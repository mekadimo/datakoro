<script lang="ts">
    import type { DatakoroSearchConceptView } from "../../../../../view/domain/model/DatakoroSearchConceptView";
    import type { View } from "$lib/view/domain/model/View";
    import { ConceptId } from "../../../../../graph/domain/model/ConceptId";
    import { GlobalState } from "../../../../../shared/infrastructure/svelte/model/GlobalState";

    export let data: DatakoroSearchConceptView;

    let { currentViewAbstractionName, currentViewConceptName, i18n } =
        GlobalState.get();

    function getConceptName(conceptId: ConceptId, view: View): string {
        const nameText =
            view.getConceptName(conceptId)?.text.capitalizedValue ??
            $i18n.t("unknown_concept_name", {
                id: conceptId.shortValue,
            });
        return nameText;
    }

    $: currentViewAbstractionName.set(null);
    $: currentViewConceptName.set(getConceptName(data.conceptId, data));
</script>

<section class="datakoro-normal-view">
    <h1>Showing results of "{data.parameters.q}"</h1>

    <!-- TODO: Create pagination component -->
    <!-- <nav
        class="pagination is-centered"
        role="navigation"
        aria-label="pagination"
    >
        <a href="#" class="pagination-previous">Previous</a>
        <a href="#" class="pagination-next">Next page</a>
        <ul class="pagination-list">
            <li>
                <a href="#" class="pagination-link" aria-label="Goto page 1"
                    >1</a
                >
            </li>
            <li><span class="pagination-ellipsis">&hellip;</span></li>
            <li>
                <a href="#" class="pagination-link" aria-label="Goto page 45"
                    >45</a
                >
            </li>
            <li>
                <a
                    class="pagination-link is-current"
                    aria-label="Page 46"
                    aria-current="page">46</a
                >
            </li>
            <li>
                <a href="#" class="pagination-link" aria-label="Goto page 47"
                    >47</a
                >
            </li>
            <li><span class="pagination-ellipsis">&hellip;</span></li>
            <li>
                <a href="#" class="pagination-link" aria-label="Goto page 86"
                    >86</a
                >
            </li>
        </ul>
    </nav> -->
</section>

<style lang="scss">
</style>
