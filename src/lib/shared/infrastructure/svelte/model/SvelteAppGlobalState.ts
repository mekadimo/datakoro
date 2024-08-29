import type { Writable } from "svelte/store";
import { getContext } from "svelte";
import { setContext } from "svelte";
import { writable } from "svelte/store";

const GLOBAL_CONTEXT_KEY = "global";

// Silly User object that will be removed later
interface TempUser { something: string }

interface AppGlobalState {
    currentTheme: Writable<"dark" | "light">; // TODO: store in user's browser
    currentUser: Writable<TempUser | null>;
}

export class SvelteAppGlobalState {
    static get(): AppGlobalState {
        const globalContext = getContext(GLOBAL_CONTEXT_KEY) as AppGlobalState;
        return globalContext;
    }

    static init() {
        const initialValue: AppGlobalState = {
            currentUser: writable(null),
            currentTheme: writable("light"),
        };
        setContext("global", initialValue);
    }
}
