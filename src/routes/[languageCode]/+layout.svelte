<script>
    import "../../app.scss";

    import GlobalContextProvider from "../../lib/shared/infrastructure/svelte/context/GlobalContextProvider.svelte";
    import Layout from "../../lib/shared/infrastructure/svelte/page/Layout.svelte";
</script>

<GlobalContextProvider>
    <Layout>
        <slot />
    </Layout>
</GlobalContextProvider>
