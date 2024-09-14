<script lang="ts">
    import { page } from "$app/stores";

    import { GlobalState } from "../model/GlobalState";

    GlobalState.init($page.params.languageCode);

    let { i18n } = GlobalState.get();
    $: $i18n.changeLanguage($page.params.languageCode);
</script>

<slot />
