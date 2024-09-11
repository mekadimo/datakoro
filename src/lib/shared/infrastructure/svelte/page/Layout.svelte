<script lang="ts">
    import Footer from "../section/Footer.svelte";
    import TopBar from "../section/TopBar.svelte";
</script>

<div class="hero is-fullheight">
    <TopBar />
    <slot />
    <Footer />
</div>
