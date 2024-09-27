import type { Writable } from "svelte/store";
import type { i18n } from "i18next";
import { createI18nStore } from "../i18n/I18n";
import { getContext } from "svelte";
import { setContext } from "svelte";
import { writable } from "svelte/store";

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
    i18nIsLoading: Writable<boolean>;
}

export class GlobalState {
    static get(): GlobalStateProps {
        const globalContext = getContext(
            GLOBAL_CONTEXT_KEY,
        ) as GlobalStateProps;
        return globalContext;
    }

    static init(languageCode: string): void {
        const i18nStore = createI18nStore(languageCode);
        const globalState: GlobalStateProps = {
            currentViewAbstractionName: writable(null),
            currentViewConceptName: writable(null),
            currentTheme: writable("light"),
            currentUser: writable(null),
            i18n: i18nStore.i18n,
            i18nIsLoading: i18nStore.isLoading,
        };
        setContext(GLOBAL_CONTEXT_KEY, globalState);
    }
}
