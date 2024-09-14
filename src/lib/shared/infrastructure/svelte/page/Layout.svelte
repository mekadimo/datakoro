<script lang="ts">
    import Footer from "../section/Footer.svelte";
    import TopBar from "../section/TopBar.svelte";
    import { GlobalState } from "../model/GlobalState";
    import { browser } from "$app/environment";

    let { i18n } = GlobalState.get();

    $: if (browser) {
        document.documentElement.setAttribute("lang", $i18n.language);
    }
</script>

<TopBar />
<div class="hero is-fullheight">
    <slot />
    <Footer />
</div>
