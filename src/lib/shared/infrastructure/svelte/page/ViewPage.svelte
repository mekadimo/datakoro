<script lang="ts">
    import ConceptAbstractionViewPage from "./view/ConceptAbstractionViewPage.svelte";
    import DatakoroLoginConceptViewPage from "./view/DatakoroLoginConceptViewPage.svelte";
    import DatakoroSearchConceptViewPage from "./view/DatakoroSearchConceptViewPage.svelte";
    import type { DtoConceptAbstractionView } from "$lib/view/application/dto/DtoConceptAbstractionView";
    import type { DtoDatakoroLoginConceptView } from "$lib/view/application/dto/DtoDatakoroLoginConceptView";
    import type { DtoDatakoroSearchConceptView } from "$lib/view/application/dto/DtoDatakoroSearchConceptView";
    import { DtoConceptAbstractionViewTransformer } from "$lib/view/application/dto/DtoConceptAbstractionView";
    import { DtoDatakoroLoginConceptViewTransformer } from "$lib/view/application/dto/DtoDatakoroLoginConceptView";
    import { DtoDatakoroSearchConceptViewTransformer } from "$lib/view/application/dto/DtoDatakoroSearchConceptView";
    import { ID_CONCEPT } from "$lib/graph/domain/model/ConceptId";
    import { ID_DATAKORO_LOGIN } from "$lib/graph/domain/model/ConceptId";
    import { ID_DATAKORO_SEARCH } from "$lib/graph/domain/model/ConceptId";

    export let data:
        | DtoConceptAbstractionView
        | DtoDatakoroLoginConceptView
        | DtoDatakoroSearchConceptView;
</script>

{#if data.conceptId === ID_DATAKORO_LOGIN.shortValue}
    <DatakoroLoginConceptViewPage
        data={DtoDatakoroLoginConceptViewTransformer.toDomain(data)}
    />
{:else if data.conceptId === ID_DATAKORO_SEARCH.shortValue}
    <DatakoroSearchConceptViewPage
        data={DtoDatakoroSearchConceptViewTransformer.toDomain(data)}
    />
{:else if data.abstractionId === ID_CONCEPT.shortValue}
    <ConceptAbstractionViewPage
        data={DtoConceptAbstractionViewTransformer.toDomain(data)}
    />
{:else}
    NOT SUPPORTED
{/if}
