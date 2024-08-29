<script lang="ts">
    import TopBar from "../section/TopBar.svelte";

    export let currentLanguageCode: string;
</script>

<TopBar {currentLanguageCode} isFixed={true} showLogotype={true} />
<section class="section datakoro-view">Work in progres...</section>

<style lang="scss">
    .datakoro-view {
        padding: 56px 0 0 0;
        // TODO: Use full screen height as min height
    }
</style>
