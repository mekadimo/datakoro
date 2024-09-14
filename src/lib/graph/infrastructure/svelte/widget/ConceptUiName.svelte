<script lang="ts">
    import type { ConceptId } from "$lib/graph/domain/model/ConceptId";
    import type { View } from "$lib/view/domain/model/View";
    import { GlobalState } from "$lib/shared/infrastructure/svelte/model/GlobalState";

    let { i18n } = GlobalState.get();

    export let conceptId: ConceptId;
    export let view: View;
</script>

{view.getConceptName(conceptId)?.text.capitalizedValue ??
    $i18n.t("unknown_concept_name", {
        id: conceptId.shortValue,
    })}
