<script lang="ts">
    import GraphIcon from "phosphor-svelte/lib/Graph";
    import MagnifyingGlassIcon from "phosphor-svelte/lib/MagnifyingGlass";

    import TopBar from "../section/TopBar.svelte";
    import { AppGlobalState } from "../model/AppGlobalState";

    let { i18n } = AppGlobalState.get();

    let searchValue = "";

    function onClickSearch(): void {
        // TODO (use classic form?)
        console.log("Searching...");
    }
</script>

<TopBar isFixed={false} showLogotype={false} />
<section class="section datakoro-home">
    <div class="columns is-centered">
        <div class="column home-search">
            <header class="has-text-centered mb-6 datakoro-title-header">
                <img
                    alt={$i18n.t("datakoro").toUpperCase()}
                    height="70px"
                    src="/img/datakoro-logotype-000-x70.png"
                />
            </header>

            <div class="control has-icons-left has-icons-right mb-5">
                <input
                    bind:value={searchValue}
                    class="input is-large is-rounded"
                    type="text"
                />
                <span class="icon is-medium is-left">
                    <GraphIcon
                        class={"" === searchValue
                            ? "search-icon-disabled"
                            : "search-icon-enabled"}
                        color={"" === searchValue ? "#dddedf" : "#313640"}
                        size="1.5em"
                    />
                </span>
                <span class="icon is-medium is-right">
                    <MagnifyingGlassIcon
                        class={"" === searchValue
                            ? "search-icon-disabled"
                            : "search-icon-enabled"}
                        color={"" === searchValue ? "#dddedf" : "#313640"}
                        size="1.5em"
                    />
                </span>
            </div>

            <div class="has-text-centered search-concepts-btn-container">
                <button
                    class="button is-link is-medium"
                    disabled={"" === searchValue}
                    on:click={onClickSearch}
                    type="button"
                >
                    {$i18n.t("search_concepts")}
                </button>
            </div>
        </div>
    </div>
</section>

<style lang="scss">
    .datakoro-home {
        padding-top: 56px;
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
