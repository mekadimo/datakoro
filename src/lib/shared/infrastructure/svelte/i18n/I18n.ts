import i18next from "i18next";
import type { Writable } from "svelte/store";
import type { i18n } from "i18next";
import { writable } from "svelte/store";

import type { ExceptionKeys } from "./locale/keys/ExceptionKeys";
import type { MainKeys } from "./locale/keys/MainKeys";
import { ExceptionEN } from "./locale/en/ExceptionEN";
import { ExceptionES } from "./locale/es/ExceptionES";
import { MainEN } from "./locale/en/MainEN";
import { MainES } from "./locale/es/MainES";

declare module "i18next" {
    interface CustomTypeOptions {
        defaultNS: "main";
        resources: {
            exception: ExceptionKeys;
            main: MainKeys;
        };
    }
}

const isLoading = writable(true);

class I18nextTranslationStore {
    public i18n: Writable<i18n>;
    public isLoading: Writable<boolean>;

    constructor(i18n: i18n) {
        this.i18n = this.createInstance(i18n);
        this.isLoading = this.createLoadingInstance(i18n);
    }

    private createInstance(i18n: i18n): Writable<i18n> {
        const i18nWritable = writable(i18n);

        i18n.on("initialized", () => {
            i18nWritable.set(i18n);
        });
        i18n.on("loaded", () => {
            i18nWritable.set(i18n);
        });
        i18n.on("added", () => i18nWritable.set(i18n));
        i18n.on("languageChanged", () => {
            i18nWritable.set(i18n);
        });

        return i18nWritable;
    }

    private createLoadingInstance(i18n: i18n): Writable<boolean> {
        i18n.on("loaded", (resources) => {
            if (0 !== Object.keys(resources).length) {
                isLoading.set(false);
            }
        });
        i18n.on("failedLoading", () => {
            isLoading.set(true);
        });
        return isLoading;
    }
}

export function createI18nStore(languageCode: string): I18nextTranslationStore {
    i18next.init({
        defaultNS: "main",
        fallbackLng: "en",
        interpolation: {
            escapeValue: false, // not needed for svelte as it escapes by default
        },
        keySeparator: false,
        lng: languageCode,
        ns: ["exception", "main"],
        resources: {
            en: {
                exception: ExceptionEN,
                main: MainEN,
            },
            es: {
                exception: ExceptionES,
                main: MainES,
            },
        },
    });
    const i18nStore = new I18nextTranslationStore(i18next);
    return i18nStore;
}
