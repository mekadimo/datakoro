<script lang="ts">
    import { browser } from "$app/environment";

    import Footer from "../section/Footer.svelte";
    import TopBar from "../section/TopBar.svelte";
    import { GlobalState } from "../model/GlobalState";
    import { THEME_LOCAL_STORAGE_KEY } from "../model/GlobalState";

    let { currentTheme, i18n } = GlobalState.get();

    $: if (browser) {
        document.documentElement.setAttribute("lang", $i18n.language);
        localStorage.setItem(THEME_LOCAL_STORAGE_KEY, $currentTheme);
        document.documentElement.setAttribute(
            "class",
            "theme-" + $currentTheme,
        );
    }
</script>

<TopBar />
<div class="hero is-fullheight">
    <slot />
    <Footer />
</div>
