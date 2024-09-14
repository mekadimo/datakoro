<script lang="ts">
    import HomePage from "../../lib/shared/infrastructure/svelte/page/HomePage.svelte";
    import { GlobalState } from "$lib/shared/infrastructure/svelte/model/GlobalState";

    const { currentViewAbstractionName, currentViewConceptName } =
        GlobalState.get();

    currentViewAbstractionName.set(null);
    currentViewConceptName.set(null);
</script>

<HomePage />
