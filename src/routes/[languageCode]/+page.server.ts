import { SUPPORTED_LANGUAGES } from "$lib/view/domain/model/SupportedLanguage.js";
import { error } from "@sveltejs/kit";

const SUPPORTED_LANGUAGE_CODES = SUPPORTED_LANGUAGES.map((l) => l.code.value);

export function load({ params }) {
    if (!SUPPORTED_LANGUAGE_CODES.includes(params.languageCode)) {
        throw error(404, "Language not supported.");
    }
}
