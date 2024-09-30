<script lang="ts">
    import GraphIcon from "phosphor-svelte/lib/Graph";
    import MagnifyingGlassIcon from "phosphor-svelte/lib/MagnifyingGlass";

    import ConceptUiName from "$lib/graph/infrastructure/svelte/widget/ConceptUiName.svelte";
    import ViewHyperlink from "$lib/shared/infrastructure/svelte/widget/ViewHyperlink.svelte";
    import type { DatakoroSearchConceptView } from "../../../../../view/domain/model/DatakoroSearchConceptView";
    import type { View } from "$lib/view/domain/model/View";
    import { ConceptId } from "../../../../../graph/domain/model/ConceptId";
    import { GlobalState } from "../../../../../shared/infrastructure/svelte/model/GlobalState";
    import { ID_CONCEPT } from "../../../../../graph/domain/model/ConceptId";
    import { ID_DATAKORO_SEARCH } from "../../../../../graph/domain/model/ConceptId";

    export let data: DatakoroSearchConceptView;

    let {
        currentTheme,
        currentViewAbstractionName,
        currentViewConceptName,
        i18n,
    } = GlobalState.get();

    function getConceptName(conceptId: ConceptId, view: View): string {
        const nameText =
            view.getConceptName(conceptId)?.text.capitalizedValue ??
            $i18n.t("unknown_concept_name", {
                id: conceptId.shortValue,
            });
        return nameText;
    }

    let searchValue = data.parameters.q;

    let searchIconDisabledColor: string;
    let searchIconEnabledColor: string;

    $: currentViewAbstractionName.set(null);
    $: currentViewConceptName.set(getConceptName(data.conceptId, data));

    // TODO: Manage this in app.scss
    $: if ("light" === $currentTheme) {
        searchIconDisabledColor = "#dddedf";
        searchIconEnabledColor = "#313640";
    } else {
        searchIconDisabledColor = "#2c2e31";
        searchIconEnabledColor = "#abb1bf";
    }
</script>

<section class="container datakoro-normal-view">
    <nav class="panel card-concept mt-4 mb-6">
        <div class="panel-block">
            <form
                action={`/${$i18n.language}/view`}
                class="column"
                method="GET"
            >
                <input
                    type="hidden"
                    name="c"
                    value={ID_DATAKORO_SEARCH.shortValue}
                />
                <div class="control has-icons-left has-icons-right mb-5">
                    <input
                        bind:value={searchValue}
                        class="input is-medium is-rounded"
                        name="q"
                        type="text"
                    />
                    <span
                        class="icon is-medium is-left"
                        class:search-icon-disabled={"" === searchValue}
                        class:search-icon-enabled={"" !== searchValue}
                    >
                        <GraphIcon
                            color={"" === searchValue
                                ? searchIconDisabledColor
                                : searchIconEnabledColor}
                            size="1.5em"
                        />
                    </span>
                    <span
                        class="icon is-medium is-right"
                        class:search-icon-disabled={"" === searchValue}
                        class:search-icon-enabled={"" !== searchValue}
                    >
                        <MagnifyingGlassIcon
                            color={"" === searchValue
                                ? searchIconDisabledColor
                                : searchIconEnabledColor}
                            size="1.5em"
                        />
                    </span>
                </div>
                <p class="search-results">
                    {#if 0 === data.data.numberOfTotalResults}
                        {$i18n.t("search_not_found", {
                            query: data.parameters.q,
                        })}
                    {:else}
                        {$i18n.t("search_results", {
                            total: data.data.numberOfTotalResults,
                        })}
                    {/if}
                </p>
            </form>
        </div>
        {#each data.data.results as conceptId}
            <ViewHyperlink
                classStr="panel-block"
                disableUnderline={true}
                params={{
                    c: conceptId.shortValue,
                    a: ID_CONCEPT.shortValue,
                }}
            >
                <span class="panel-icon">
                    <GraphIcon size="1em" />
                </span>
                <ConceptUiName {conceptId} view={data} />
            </ViewHyperlink>
        {/each}
    </nav>
</section>

<style lang="scss">
    .search-results {
        font-style: italic;
    }
</style>
