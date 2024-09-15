<script lang="ts">
    import BellIcon from "phosphor-svelte/lib/Bell";
    import BellRingingIcon from "phosphor-svelte/lib/BellRinging";
    import BellSlashIcon from "phosphor-svelte/lib/BellSlash";
    import GlobeIcon from "phosphor-svelte/lib/Globe";

    import ChangeLanguageModal from "./ChangeLanguageModal.svelte";
    import ViewHyperlink from "../widget/ViewHyperlink.svelte";
    import { GlobalState } from "../model/GlobalState";
    import { ID_DATAKORO_LOGIN } from "$lib/graph/domain/model/ConceptId";

    let {
        currentViewAbstractionName,
        currentViewConceptName,
        currentUser,
        i18n,
    } = GlobalState.get();

    let languageModalIsOpen = false;
    let smallScreenMenuIsOpen = false;

    function hideLanguageModal(): void {
        languageModalIsOpen = false;
    }

    function showLanguageModal(): void {
        languageModalIsOpen = true;
    }

    function toggleSmallScreenMenu(): void {
        smallScreenMenuIsOpen = !smallScreenMenuIsOpen;
    }
</script>

<header class="has-text-centered">
    <ChangeLanguageModal isOpen={languageModalIsOpen} {hideLanguageModal} />

    {#if null != $currentViewConceptName}
        <nav class="view-nav">
            <h1>{$currentViewConceptName}</h1>
            {#if null != $currentViewAbstractionName}
                <h2>{$currentViewAbstractionName}</h2>
            {/if}
        </nav>
    {/if}

    <nav
        aria-label="main navigation"
        class:has-current-concept={null != $currentViewConceptName}
        class="navbar is-white is-fixed-top"
    >
        <div class="navbar-brand">
            {#if null != $currentViewConceptName}
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
                class:is-active={smallScreenMenuIsOpen}
                data-target="navbarBasicExample"
                on:click={toggleSmallScreenMenu}
            >
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </button>
        </div>

        <div class="navbar-menu" class:is-active={smallScreenMenuIsOpen}>
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
        background-color: white;
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
        align-items: center;
        background-color: transparent;
        display: flex;
        flex-direction: column;
        height: 57px;
        justify-content: center;
        position: fixed;
        z-index: 100;
        left: 300px;
        right: 300px;
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
        width: 100%;
        padding: 0;
        box-sizing: border-box;
        text-align: center;
    }

    .navbar-burger span {
        background-color: black;
    }
</style>
