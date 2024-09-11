import type { Handle } from "@sveltejs/kit";

const URL_LANGUAGE_CODE_REGEX = /^\/([a-z-]+)/;

export const handle = (async ({ event, resolve }) => {
    const url = event.url.pathname;

    const match = url.match(URL_LANGUAGE_CODE_REGEX);
    const languageCode = match ? match[1] : "en";

    return resolve(event, {
        transformPageChunk: ({ html }) => html.replace("%lang%", languageCode),
    });
}) satisfies Handle;
