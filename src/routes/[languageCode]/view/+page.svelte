<script lang="ts">
    import ViewPage from "../../../lib/shared/infrastructure/svelte/page/ViewPage.svelte";
    import { AppGlobalState } from "$lib/shared/infrastructure/svelte/model/AppGlobalState";
    import { ConceptId } from "$lib/graph/domain/model/ConceptId.js";
    import { page } from "$app/stores";

    export let data;

    const { currentAbstractionId, currentConceptId } = AppGlobalState.get();
    $: currentAbstractionId.update(() => {
        const aGetParam = $page.url.searchParams.get("a");
        if (null == aGetParam) {
            return null;
        }
        return new ConceptId(aGetParam);
    });
    $: currentConceptId.set(
        new ConceptId($page.url.searchParams.get("c") as string),
    );
</script>

<ViewPage {data} />
