<script lang="ts">
    import MoonIcon from "phosphor-svelte/lib/Moon";
    import SunIcon from "phosphor-svelte/lib/Sun";

    import UiDateTime from "../widget/UiDateTime.svelte";
    import { FooterCurrentDateTime } from "$lib/shared/domain/model/UiValue";
    import { GlobalState } from "../model/GlobalState";

    let { i18n } = GlobalState.get();

    let { currentTheme } = GlobalState.get();

    function onClickChangeTheme(): void {
        if ("light" === $currentTheme) {
            currentTheme.set("dark");
        } else {
            currentTheme.set("light");
        }
    }
</script>

<footer class="footer">
    <div class="content">
        <div class="columns is-centered">
            <div class="column has-text-left">
                <p>
                    © {new Date().getFullYear()}
                    <a class="mr-5" href="https://mekadimo.org" target="_blank">
                        {$i18n.t("mekadimo_project")}
                    </a>
                    <a
                        class="mr-5"
                        href="https://github.com/mekadimo/datakoro"
                        target="_blank"
                    >
                        {$i18n.t("source_code")}
                    </a>
                </p>
            </div>
            <div class="column has-text-right">
                <p>
                    <span class="ml-5">
                        <UiDateTime
                            mekadimo={true}
                            showNames={true}
                            showTime={false}
                            value={new FooterCurrentDateTime(new Date())}
                        />
                    </span>
                    <span class="change-theme ml-5">
                        <button
                            on:click={onClickChangeTheme}
                            title={$i18n.t("change_theme")}
                        >
                            {#if "light" === $currentTheme}
                                <MoonIcon size="1.5em" />
                            {/if}
                            {#if "dark" === $currentTheme}
                                <SunIcon size="1.5em" />
                            {/if}
                        </button>
                    </span>
                </p>
            </div>
        </div>
    </div>
</footer>

<style lang="scss">
    .change-theme {
        position: relative;
        top: 0.3rem;
    }

    .footer {
        padding: 30px 24px 30px 24px;
    }

    .footer a:hover {
        text-decoration: none;
    }
</style>
