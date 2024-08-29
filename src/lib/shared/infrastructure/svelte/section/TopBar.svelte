<script lang="ts">
    import BellIcon from "phosphor-svelte/lib/Bell";
    import BellRingingIcon from "phosphor-svelte/lib/BellRinging";
    import BellSlashIcon from "phosphor-svelte/lib/BellSlash";
    import GlobeIcon from "phosphor-svelte/lib/Globe";

    import { SvelteAppGlobalState } from "../model/SvelteAppGlobalState";
    import { page } from "$app/stores";

    export let currentLanguageCode: string;
    export let isFixed: boolean;
    export let showLogotype: boolean;

    let { currentUser } = SvelteAppGlobalState.get();

    let languageModalIsOpen = false;

    function onClickHideLanguageModal(): void {
        languageModalIsOpen = false;
    }

    function onClickShowLanguageModal(): void {
        languageModalIsOpen = true;
    }

    function onClickShowMenu(): void {
        // TODO
        console.log("Showing menu...");
    }

    function i18nUrl(languageCode: string): string {
        const url = $page.url.pathname;
        const regex = /^\/[a-z]+(\/|$)/;
        const newUrl = url.replace(regex, `/${languageCode}$1`);
        return newUrl;
    }
</script>

<header class="has-text-centered">
    <div class="modal" class:is-active={languageModalIsOpen}>
        <div class="modal-background" on:click={onClickHideLanguageModal}></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Change current language</p>
                <button
                    aria-label="close"
                    class="delete"
                    on:click={onClickHideLanguageModal}
                ></button>
            </header>
            <section class="modal-card-body">
                <aside class="menu">
                    <ul class="menu-list">
                        <li>
                            <a
                                class:is-active={"en" === currentLanguageCode}
                                href={i18nUrl("en")}
                            >
                                English
                            </a>
                        </li>
                        <li>
                            <a
                                class:is-active={"es" === currentLanguageCode}
                                href={i18nUrl("es")}
                            >
                                Español (Spanish)
                            </a>
                        </li>
                    </ul>
                </aside>
            </section>
            <footer class="modal-card-foot">
                <div class="buttons">
                    <button class="button is-link">Save changes</button>
                    <button class="button">Cancel</button>
                </div>
            </footer>
        </div>
    </div>
    <nav
        aria-label="main navigation"
        class:is-fixed-top={isFixed}
        class="navbar is-white"
        role="navigation"
    >
        <div class="navbar-brand">
            {#if showLogotype}
                <a class="navbar-item" href={`/${currentLanguageCode}`}>
                    <img
                        alt="DATAKORO"
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
                on:click={onClickShowMenu}
            >
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
            </button>
        </div>

        <div class="navbar-menu">
            <div class="navbar-start">
                <a
                    class="navbar-item"
                    href=""
                    on:click={onClickShowLanguageModal}
                >
                    <span>
                        <span class="language-selector-icon">
                            <GlobeIcon color="#444" size="1em" />
                        </span>
                        {currentLanguageCode.toUpperCase()}
                    </span>
                </a>

                <a class="navbar-item" href=""> Contributions </a>
            </div>

            <div class="navbar-end">
                {#if null === $currentUser}
                    <div class="navbar-item">
                        <div class="buttons">
                            <a
                                class="button is-link support-button"
                                href="https://www.patreon.com/Lajto"
                                target="_blank"
                            >
                                <strong>Support Lajto!</strong>
                            </a>
                            <a class="button is-light" href=""> Log in </a>
                        </div>
                    </div>
                {:else}
                    <a class="navbar-item" href="">
                        <!-- <BellIcon color="#111111" size="1.5em" />
                        <BellSlashIcon color="#111111" size="1.5em" /> -->
                        <span class="notification-bell">
                            <BellRingingIcon color="#111111" size="1.5em" />
                        </span>
                        <span class="tag is-black notification-tag">+9</span>
                    </a>

                    <div class="navbar-item has-dropdown is-hoverable">
                        <a class="navbar-link" href="">
                            <span>Lajto</span>
                            <figure class="image is-24x24">
                                <img
                                    alt="Profile"
                                    class="is-rounded"
                                    src="https://avatars.githubusercontent.com/u/85128868?s=400&u=23a894ff6b788c000f7c54651eabbb47596e22b0&v=4"
                                />
                            </figure>
                        </a>

                        <div class="navbar-dropdown">
                            <a class="navbar-item"> Profile </a>
                            <a class="navbar-item"> Account </a>
                            <hr class="navbar-divider" />
                            <a class="navbar-item"> Log out </a>
                        </div>
                    </div>
                {/if}
            </div>
        </div>
    </nav>
</header>

<style lang="scss">
    .language-select {
        max-width: 200px;
    }

    .language-selector-icon {
        position: relative;
        top: 2px;
    }

    .navbar.is-fixed-top {
        background-color: #fff;
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
</style>
