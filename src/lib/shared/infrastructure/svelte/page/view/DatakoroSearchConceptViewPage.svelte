<script lang="ts">
    import type { DatakoroSearchConceptView } from "../../../../../view/domain/model/DatakoroSearchConceptView";
    import { AppGlobalState } from "../../model/AppGlobalState";

    export let data: DatakoroSearchConceptView;

    let { i18n } = AppGlobalState.get();
</script>

<h1>Showing results of "{data.parameters.q}"</h1>

<!-- TODO: Create pagination component -->
<nav class="pagination is-centered" role="navigation" aria-label="pagination">
    <a href="#" class="pagination-previous">Previous</a>
    <a href="#" class="pagination-next">Next page</a>
    <ul class="pagination-list">
        <li>
            <a href="#" class="pagination-link" aria-label="Goto page 1">1</a>
        </li>
        <li><span class="pagination-ellipsis">&hellip;</span></li>
        <li>
            <a href="#" class="pagination-link" aria-label="Goto page 45">45</a>
        </li>
        <li>
            <a
                class="pagination-link is-current"
                aria-label="Page 46"
                aria-current="page">46</a
            >
        </li>
        <li>
            <a href="#" class="pagination-link" aria-label="Goto page 47">47</a>
        </li>
        <li><span class="pagination-ellipsis">&hellip;</span></li>
        <li>
            <a href="#" class="pagination-link" aria-label="Goto page 86">86</a>
        </li>
    </ul>
</nav>

<style lang="scss">
</style>
