import { SUPPORTED_LANGUAGES } from "$lib/view/domain/model/SupportedLanguage.js";
import { redirect } from "@sveltejs/kit";

const SUPPORTED_LANGUAGE_CODES = SUPPORTED_LANGUAGES.map((l) => l.code.value);

export function load({ request }) {
    const acceptLanguage = request.headers.get("accept-language");

    const languageCode = acceptLanguage?.split(",")[0].split("-")[0] || "en";
    if (!SUPPORTED_LANGUAGE_CODES.includes(languageCode)) {
        throw redirect(307, `/en`);
    }

    throw redirect(307, `/${languageCode}`);
}
