<script lang="ts">
    import ViewPage from "../../../lib/shared/infrastructure/svelte/page/ViewPage.svelte";

    export let data;
</script>

<ViewPage currentLanguageCode={data.languageCode} />
