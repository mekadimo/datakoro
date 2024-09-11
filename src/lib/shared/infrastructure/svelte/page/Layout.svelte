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

<TopBar />
<div class="hero is-fullheight">
    <slot />
    <Footer />
</div>

<style lang="scss">
    .main-wrapper {
        padding: 0;
    }
</style>
