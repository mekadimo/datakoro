<script lang="ts">
    import HomePage from "../../lib/shared/infrastructure/svelte/page/HomePage.svelte";
    import { AppGlobalState } from "$lib/shared/infrastructure/svelte/model/AppGlobalState";

    const { currentConceptId } = AppGlobalState.get();
    currentConceptId.set(null);
</script>

<HomePage />
