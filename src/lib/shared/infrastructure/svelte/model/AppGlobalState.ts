import i18next from "i18next";
import type { Writable } from "svelte/store";
import type { i18n } from "i18next";
import { createI18nStore } from "svelte-i18next";
import { getContext } from "svelte";
import { setContext } from "svelte";
import { writable } from "svelte/store";

import type { ConceptId } from "$lib/graph/domain/model/ConceptId";
import { enTranslations } from "./i18n/en";
import { esTranslations } from "./i18n/es";

const GLOBAL_CONTEXT_KEY = "global";

// Silly User object that will be removed later
interface TempUser {
    something: string;
}

interface AppGlobalStateProps {
    currentAbstractionId: Writable<ConceptId | null>;
    currentConceptId: Writable<ConceptId | null>;
    currentTheme: Writable<"dark" | "light">; // TODO: store in user's browser
    currentUser: Writable<TempUser | null>;
    i18n: Writable<i18n>;
}

export class AppGlobalState {
    static get(): AppGlobalStateProps {
        const globalContext = getContext(
            GLOBAL_CONTEXT_KEY,
        ) as AppGlobalStateProps;
        return globalContext;
    }

    static init(languageCode: string): void {
        const i18n = AppGlobalState.initI18n(languageCode);
        const globalState: AppGlobalStateProps = {
            currentAbstractionId: writable(null),
            currentConceptId: writable(null),
            currentTheme: writable("light"),
            currentUser: writable(null),
            i18n,
        };
        setContext(GLOBAL_CONTEXT_KEY, globalState);
    }

    private static initI18n(languageCode: string): Writable<i18n> {
        i18next.init({
            lng: languageCode,
            resources: {
                en: {
                    translation: enTranslations,
                },
                es: {
                    translation: esTranslations,
                },
            },
            interpolation: {
                escapeValue: false, // not needed for svelte as it escapes by default
            },
            // TODO
            // fallbackLng: "en",
            // ns: "common",
            // backend: {
            //     loadPath: "/locales/{{lng}}/{{ns}}.json",
            // },
        });
        return createI18nStore(i18next);
    }
}
