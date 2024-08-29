<script lang="ts">
    import HomePage from "../../lib/shared/infrastructure/svelte/page/HomePage.svelte";

    export let data;
</script>

<HomePage currentLanguageCode={data.languageCode} />
