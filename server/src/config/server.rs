use actix_files::Files;
use actix_identity::IdentityMiddleware;
use actix_session::SessionMiddleware;
use actix_session::config::CookieContentSecurity;
use actix_session::config::PersistentSession;
use actix_session::storage::CookieSessionStore;
use actix_web::HttpServer;
use actix_web::cookie;
use actix_web::dev::ServerHandle;
use actix_web::dev::Service;
use actix_web::http;
use actix_web::web;
use chrono::Utc;
use core::future::Future;
use datakoro_gui::App;
use futures::FutureExt;
use leptos::get_configuration;
use leptos::view;
use leptos_actix::LeptosRoutes;
use leptos_actix::generate_route_list;
use rand::Rng;
use std::sync::Arc;
use std::sync::Mutex;
use tokio;

pub struct DatakoroServer {
    pub thread: tokio::task::JoinHandle<Result<(), std::io::Error>>,
    pub handle: Handle,
}

#[derive(Clone)]
pub struct Handle(pub Arc<Mutex<Option<ServerHandle>>>);

const COOKIE_DURATION_IN_DAYS: i64 = 7;
const HSTS_HEADER_VALUE: &'static str = "max-age=63072000"; // 2 years

impl Handle {
    pub fn new() -> Self {
        Self(Arc::new(Mutex::new(None)))
    }

    pub fn replace(&self, handle: ServerHandle) -> Option<ServerHandle> {
        self.0.lock().unwrap().replace(handle)
    }

    pub async fn _stop(&self, graceful: bool) -> impl Future<Output = ()> {
        let o = self.0.lock().unwrap().take();
        match o {
            Some(server_handle) => { server_handle.stop(graceful) }
            None => {
                panic!("None in Handle::stop()");
            }
        }
    }
}

#[actix_web::get("favicon.ico")]
async fn favicon(
    leptos_options: actix_web::web::Data<leptos::LeptosOptions>
) -> actix_web::Result<actix_files::NamedFile> {
    let leptos_options = leptos_options.into_inner();
    let site_root = &leptos_options.site_root;
    Ok(actix_files::NamedFile::open(format!("{site_root}/img/favicon.ico"))?)
}

pub async fn start_server() {
    // TODO: Store somewhere so cookies keep working after a restart.
    let cookie_pkey: actix_web::cookie::Key = actix_web::cookie::Key::derive_from(
        &rand::thread_rng().gen::<[u8; 32]>()
    );

    loop {
        let server = start_server_thread(cookie_pkey.clone()).await;
        println!("SERVER ON");

        match server.thread.await {
            Ok(_) => {
                if let None = server.handle.0.lock().unwrap().take() {
                    println!("Restarting server...");
                    continue;
                } else {
                    break;
                }
            }
            Err(e) => {
                panic!("SERVER ERROR: {:?}", e);
            }
        }
    }
}

async fn start_server_thread(cookie_pkey: cookie::Key) -> DatakoroServer {
    let handle = Handle::new();

    let startup_code = format!("{:x}", Utc::now().timestamp());

    let handle_server = web::Data::new(handle.clone());

    let conf_file = get_configuration(None).await.unwrap();
    let http_socket_addr = conf_file.leptos_options.site_addr;
    let routes = generate_route_list(|| view! { <App/> });

    let server = HttpServer::new(move || {
        let leptos_options = &conf_file.leptos_options;
        let site_root = &leptos_options.site_root;

        actix_web::App
            ::new()
            .app_data(web::Data::new(startup_code.clone()))
            .app_data(web::Data::clone(&handle_server))
            // wrap() and wrap_fn() execution order goes from last to first
            .wrap(IdentityMiddleware::default())
            .wrap(
                SessionMiddleware::builder(CookieSessionStore::default(), cookie_pkey.clone())
                    .session_lifecycle(
                        PersistentSession::default().session_ttl(
                            cookie::time::Duration::days(COOKIE_DURATION_IN_DAYS)
                        )
                    )
                    .cookie_content_security(CookieContentSecurity::Private)
                    .cookie_secure(true)
                    .build()
            )
            .wrap_fn(|service_request, service| {
                service.call(service_request).map(|result| {
                    let mut service_response = result.unwrap();
                    service_response
                        .headers_mut()
                        .insert(
                            http::header::STRICT_TRANSPORT_SECURITY,
                            http::header::HeaderValue::from_static(HSTS_HEADER_VALUE)
                        );
                    Ok(service_response)
                })
            })
            // .route("/api/{tail:.*}", leptos_actix::handle_server_fns())
            .service(Files::new("/pkg", format!("{site_root}/pkg")))
            .service(Files::new("/assets", site_root))
            .service(favicon)
            .leptos_routes(leptos_options.to_owned(), routes.to_owned(), || view! { <App/> })
            .app_data(web::Data::new(leptos_options.to_owned()))
        //.wrap(middleware::Compress::default())
    })
        .bind(&http_socket_addr)
        .unwrap()
        .run();

    handle.replace(server.handle());

    let server_thread = tokio::spawn(server);

    DatakoroServer {
        thread: server_thread,
        handle,
    }
}
