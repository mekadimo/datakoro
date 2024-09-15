<script lang="ts">
    import { GlobalState } from "../model/GlobalState";

    let { i18n } = GlobalState.get();

    export let classStr: string | undefined = undefined;
    export let disableUnderline: boolean = false;
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

<a
    class={classStr}
    class:disabled-underline={disableUnderline}
    href={`/${$i18n.language}/view?${getParams()}`}
>
    <slot />
</a>

<style lang="scss">
    .disabled-underline,
    .disabled-underline:hover {
        text-decoration: none;
    }

    .panel {
        border: solid #eee 1px;
    }
</style>
