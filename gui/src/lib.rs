use leptos::IntoView;
use leptos::component;
use leptos::tracing;
use leptos::view;
use leptos_meta::Stylesheet;
use leptos_meta::Title;
use leptos_meta::provide_meta_context;
use leptos_router::Route;
use leptos_router::Router;
use leptos_router::Routes;

#[component]
pub fn App() -> impl IntoView {
    provide_meta_context();

    view! {
        // id=leptos means cargo-leptos will hot-reload this stylesheet
        <Stylesheet id="leptos" href="/pkg/site.css" />

        <Title text="Datakoro" />

        <Router>
            <Routes>
                <Route path="" view=|| view! { "hello world" } />
                <Route path="/*any" view=|| view! { "not found" } />
            </Routes>
        </Router>
    }
}
