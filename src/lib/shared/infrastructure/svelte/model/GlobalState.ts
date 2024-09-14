import i18nextInstance from "i18next";
import type { Writable } from "svelte/store";
import type { i18n } from "i18next";
import { createI18nStore } from "svelte-i18next";
import { getContext } from "svelte";
import { setContext } from "svelte";
import { writable } from "svelte/store";

import { enTranslations } from "./i18n/en";
import { esTranslations } from "./i18n/es";

const GLOBAL_CONTEXT_KEY = "global";

// Silly User object that will be removed later
interface TempUser {
    something: string;
}

interface GlobalStateProps {
    currentViewAbstractionName: Writable<string | null>;
    currentViewConceptName: Writable<string | null>;
    currentTheme: Writable<"dark" | "light">; // TODO: store in user's browser
    currentUser: Writable<TempUser | null>;
    i18n: Writable<i18n>;
}

export class GlobalState {
    static get(): GlobalStateProps {
        const globalContext = getContext(
            GLOBAL_CONTEXT_KEY,
        ) as GlobalStateProps;
        return globalContext;
    }

    static init(languageCode: string): void {
        i18nextInstance.init({
            lng: languageCode,
            resources: {
                en: { translation: enTranslations },
                es: { translation: esTranslations },
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

        const globalState: GlobalStateProps = {
            currentViewAbstractionName: writable(null),
            currentViewConceptName: writable(null),
            currentTheme: writable("light"),
            currentUser: writable(null),
            i18n: createI18nStore(i18nextInstance),
        };
        setContext(GLOBAL_CONTEXT_KEY, globalState);
    }
}
