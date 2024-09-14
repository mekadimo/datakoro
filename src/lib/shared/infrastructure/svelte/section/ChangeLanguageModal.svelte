<script lang="ts">
    import { GlobalState } from "../model/GlobalState";
    import { SUPPORTED_LANGUAGES } from "$lib/view/domain/model/SupportedLanguage";
    import { page } from "$app/stores";

    const URL_LANGUAGE_CODE_REGEX = /^\/[a-z-]+(\/|$)/;

    let { i18n } = GlobalState.get();

    export let isOpen: boolean;
    export let hideLanguageModal: () => void;

    function i18nUrl(languageCode: string, currentPage: typeof $page): string {
        const url = currentPage.url.pathname;
        const newUrl =
            url.replace(URL_LANGUAGE_CODE_REGEX, `/${languageCode}$1`) +
            currentPage.url.search;
        return newUrl;
    }
</script>

<div class="modal" class:is-active={isOpen}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="modal-background" on:click={hideLanguageModal}></div>
    <div class="modal-card">
        <header class="modal-card-head">
            <p class="modal-card-title">
                {$i18n.t("change_current_language")}
            </p>
            <button
                aria-label="close"
                class="delete"
                on:click={hideLanguageModal}
                title={$i18n.t("close")}
            ></button>
        </header>
        <section class="modal-card-body">
            <aside class="menu">
                <ul class="menu-list">
                    {#each SUPPORTED_LANGUAGES as supportedLanguage}
                        <li>
                            <a
                                class:is-active={supportedLanguage.code
                                    .value === $i18n.language}
                                href={i18nUrl(
                                    supportedLanguage.code.value,
                                    $page,
                                )}
                            >
                                {supportedLanguage.originalName.value}
                                {#if supportedLanguage.code.value !== $i18n.language}
                                    ({$i18n.t(
                                        "language_" +
                                            supportedLanguage.code.value,
                                    )})
                                {/if}
                            </a>
                        </li>
                    {/each}
                </ul>
            </aside>
        </section>
        <footer class="modal-card-foot">
            <div class="buttons is-centered">
                <button class="button" on:click={hideLanguageModal}>
                    {$i18n.t("close")}
                </button>
            </div>
        </footer>
    </div>
</div>
