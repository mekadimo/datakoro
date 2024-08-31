<script lang="ts">
    import { page } from "$app/stores";

    import { AppGlobalState } from "../model/AppGlobalState";

    AppGlobalState.init($page.params.languageCode);

    let { i18n } = AppGlobalState.get();
    $: $i18n.changeLanguage($page.params.languageCode);
</script>

<slot />
