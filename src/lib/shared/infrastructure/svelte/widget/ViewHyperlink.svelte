<script lang="ts">
    import { AppGlobalState } from "../model/AppGlobalState";

    let { i18n } = AppGlobalState.get();

    export let classStr: string | undefined = undefined;
    export let params: {
        c: string;
        [key: string]: string | number | boolean;
    };

    const getParams = () => {
        return Object.entries(params)
            .map(
                ([key, value]) =>
                    `${key}=${encodeURIComponent(value.toString())}`,
            )
            .join("&");
    };
</script>

<a class={classStr} href={`/${$i18n.language}/view?${getParams()}`}>
    <slot />
</a>
