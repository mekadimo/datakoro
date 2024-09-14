<script lang="ts">
    import GraphIcon from "phosphor-svelte/lib/Graph";
    import MagnifyingGlassIcon from "phosphor-svelte/lib/MagnifyingGlass";

    import { GlobalState } from "../model/GlobalState";
    import { ID_DATAKORO_SEARCH } from "../../../../graph/domain/model/ConceptId";

    let { i18n } = GlobalState.get();

    let searchValue = "";
</script>

<svelte:head>
    <title>{$i18n.t("datakoro")}</title>
</svelte:head>

<section class="section datakoro-home">
    <div class="columns is-centered">
        <form
            action={`/${$i18n.language}/view`}
            class="column home-search"
            method="GET"
        >
            <header class="has-text-centered mb-6 datakoro-title-header">
                <img
                    alt={$i18n.t("datakoro").toUpperCase()}
                    height="70px"
                    src="/img/datakoro-logotype-000-x70.png"
                />
            </header>

            <input
                type="hidden"
                name="c"
                value={ID_DATAKORO_SEARCH.shortValue}
            />

            <div class="control has-icons-left has-icons-right mb-5">
                <!-- svelte-ignore a11y-autofocus -->
                <input
                    autofocus
                    bind:value={searchValue}
                    class="input is-large is-rounded"
                    name="q"
                    type="text"
                />
                <span
                    class="icon is-medium is-left"
                    class:search-icon-disabled={"" === searchValue}
                    class:search-icon-enabled={"" !== searchValue}
                >
                    <GraphIcon
                        color={"" === searchValue ? "#dddedf" : "#313640"}
                        size="1.5em"
                    />
                </span>
                <span
                    class="icon is-medium is-right"
                    class:search-icon-disabled={"" === searchValue}
                    class:search-icon-enabled={"" !== searchValue}
                >
                    <MagnifyingGlassIcon
                        color={"" === searchValue ? "#dddedf" : "#313640"}
                        size="1.5em"
                    />
                </span>
            </div>

            <div class="has-text-centered search-concepts-btn-container">
                <button
                    class="button is-link is-medium"
                    disabled={"" === searchValue}
                    type="submit"
                >
                    {$i18n.t("search_concepts")}
                </button>
            </div>
        </form>
    </div>
</section>

<style lang="scss">
    .datakoro-home {
        padding-top: 250px;
    }

    .datakoro-title-header {
        position: relative;
    }

    .home-search {
        flex: none;
        width: 584px;
    }

    .search-concepts-btn-container {
        height: 200px;
    }

    .search-icon-disabled {
        color: #dddedf;
    }

    .search-icon-enabled {
        color: #313640;
    }
</style>
