<script lang="ts">
    import BellIcon from "phosphor-svelte/lib/Bell";
    import BellRingingIcon from "phosphor-svelte/lib/BellRinging";
    import BellSlashIcon from "phosphor-svelte/lib/BellSlash";
    import GlobeIcon from "phosphor-svelte/lib/Globe";

    import ChangeLanguageModal from "./ChangeLanguageModal.svelte";
    import ViewHyperlink from "../widget/ViewHyperlink.svelte";
    import { AppGlobalState } from "../model/AppGlobalState";
    import { ID_DATAKORO_LOGIN } from "$lib/graph/domain/model/ConceptId";

    let { currentAbstractionId, currentConceptId, currentUser, i18n } =
        AppGlobalState.get();

    let languageModalIsOpen = false;

    function hideLanguageModal(): void {
        languageModalIsOpen = false;
    }

    function showLanguageModal(): void {
        languageModalIsOpen = true;
    }

    function showMenu(): void {
        // TODO
        console.log("Showing menu...");
    }
</script>

<header class="has-text-centered">
    <ChangeLanguageModal isOpen={languageModalIsOpen} {hideLanguageModal} />

    {#if null != $currentConceptId}
        <!-- TODO: Implement naming system and use the proper ones -->
        <nav class="view-nav">
            <h1>{$currentConceptId.shortValue}</h1>
            {#if null != $currentAbstractionId}
                <h2>{$currentAbstractionId.shortValue}</h2>
            {/if}
        </nav>
    {/if}

    <nav
        aria-label="main navigation"
        class:has-current-concept={null != $currentConceptId}
        class="navbar is-white is-fixed-top"
    >
        <div class="navbar-brand">
            {#if null != $currentConceptId}
                <a class="navbar-item" href={`/${$i18n.language}`}>
                    <img
                        alt={$i18n.t("datakoro").toUpperCase()}
                        height="70px"
                        src="/img/datakoro-logotype-000-x28.png"
                    />
                </a>
            {/if}

            <button
                aria-expanded="false"
                aria-label="menu"
                class="navbar-burger"
                data-target="navbarBasicExample"
                on:click={showMenu}
            >
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </button>
        </div>

        <div class="navbar-menu">
            <div class="navbar-start">
                <button class="navbar-item" on:click={showLanguageModal}>
                    <span>
                        <span class="language-selector-icon">
                            <GlobeIcon color="#444" size="1em" />
                        </span>
                        {$i18n.language.toUpperCase()}
                    </span>
                </button>
            </div>

            <div class="navbar-end">
                {#if null === $currentUser}
                    <div class="navbar-item">
                        <div class="buttons">
                            <ViewHyperlink
                                classStr="button is-light"
                                params={{ c: ID_DATAKORO_LOGIN.shortValue }}
                            >
                                {$i18n.t("log_in")}
                            </ViewHyperlink>
                            <a
                                class="button is-link support-button"
                                href="https://www.patreon.com/Lajto"
                                target="_blank"
                            >
                                <strong>{$i18n.t("support_lajto")}</strong>
                            </a>
                        </div>
                    </div>
                {:else}
                    <button class="navbar-item">
                        <span class="notification-bell">
                            <BellIcon color="#111111" size="1.5em" />
                            <BellSlashIcon color="#111111" size="1.5em" />
                            <BellRingingIcon color="#111111" size="1.5em" />
                        </span>
                        <span class="tag is-black notification-tag">+9</span>
                    </button>

                    <div class="navbar-item has-dropdown is-hoverable">
                        <button class="navbar-link">
                            <span>Lajto</span>
                            <figure class="image is-24x24">
                                <img
                                    alt="Profile"
                                    class="is-rounded"
                                    src="https://avatars.githubusercontent.com/u/85128868?s=400&u=23a894ff6b788c000f7c54651eabbb47596e22b0&v=4"
                                />
                            </figure>
                        </button>

                        <div class="navbar-dropdown">
                            <ViewHyperlink
                                classStr="navbar-item"
                                params={{ c: ID_DATAKORO_LOGIN.shortValue }}
                            >
                                {$i18n.t("profile")}
                            </ViewHyperlink>
                            <ViewHyperlink
                                classStr="navbar-item"
                                params={{ c: ID_DATAKORO_LOGIN.shortValue }}
                            >
                                {$i18n.t("contributions")}
                            </ViewHyperlink>
                            <ViewHyperlink
                                classStr="navbar-item"
                                params={{ c: ID_DATAKORO_LOGIN.shortValue }}
                            >
                                {$i18n.t("account")}
                            </ViewHyperlink>
                            <hr class="navbar-divider" />
                            <ViewHyperlink
                                classStr="navbar-item"
                                params={{ c: ID_DATAKORO_LOGIN.shortValue }}
                            >
                                {$i18n.t("log_out")}
                            </ViewHyperlink>
                        </div>
                    </div>
                {/if}
            </div>
        </div>
    </nav>
</header>

<style lang="scss">
    .language-selector-icon {
        position: relative;
        top: 2px;
    }

    .navbar.is-fixed-top {
        background-color: transparent;
    }

    .navbar.has-current-concept {
        border-bottom: #ddd 1px solid;
    }

    .notification-bell {
        position: relative;
        left: 5px;
        padding-top: 6px;
    }

    .notification-tag {
        position: relative;
        right: 5px;
    }

    .support-button:hover {
        color: white;
    }

    .view-nav {
        background-color: #fff;
        width: 100%;
        height: 57px;
        position: fixed;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .view-nav h1 {
        font-weight: bold;
        margin: 0;
    }

    .view-nav h2 {
        font-style: italic;
        margin: 0;
    }

    .view-nav h1,
    .view-nav h2 {
        max-width: 100%;
        padding: 0 300px;
        box-sizing: border-box;
        text-align: center;
    }
</style>
