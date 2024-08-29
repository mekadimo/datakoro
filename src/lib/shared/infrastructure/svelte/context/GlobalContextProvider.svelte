<script lang="ts">
    import { SvelteAppGlobalState } from "../model/SvelteAppGlobalState";

    SvelteAppGlobalState.init();
</script>

<slot />
