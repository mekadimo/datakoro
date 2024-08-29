<script lang="ts">
    import Footer from "../section/Footer.svelte";
    import GlobalContextProvider from "../context/GlobalContextProvider.svelte";
</script>

<GlobalContextProvider>
    <div class="hero is-fullheight">
        <slot />
        <Footer />
    </div>
</GlobalContextProvider>
