<script lang="ts">
    import { AppGlobalState } from "../model/AppGlobalState";
    import { page } from "$app/stores";

    let { i18n } = AppGlobalState.get();

    export let isOpen;
    export let hideLanguageModal: () => void;

    const SUPPORTED_LANGUAGES = [
        { code: "en", originalName: "English" },
        { code: "es", originalName: "Español" },
    ];

    function i18nUrl(languageCode: string): string {
        const url = $page.url.pathname;
        const regex = /^\/[a-z]+(\/|$)/;
        const newUrl =
            url.replace(regex, `/${languageCode}$1`) + $page.url.search;
        return newUrl;
    }
</script>

<div class="modal" class:is-active={isOpen}>
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
                                class:is-active={supportedLanguage.code ===
                                    $i18n.language}
                                href={i18nUrl(supportedLanguage.code)}
                            >
                                {supportedLanguage.originalName}
                                {#if supportedLanguage.code !== $i18n.language}
                                    ({$i18n.t(
                                        "language_" + supportedLanguage.code,
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
