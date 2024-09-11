<script lang="ts">
    import Footer from "../section/Footer.svelte";
    import TopBar from "../section/TopBar.svelte";
    import { AppGlobalState } from "../model/AppGlobalState";
    import { browser } from "$app/environment";

    let { i18n } = AppGlobalState.get();

    $: if (browser) {
        document.documentElement.setAttribute("lang", $i18n.language);
    }
</script>

<div class="hero is-fullheight">
    <TopBar />
    <slot />
    <Footer />
</div>
