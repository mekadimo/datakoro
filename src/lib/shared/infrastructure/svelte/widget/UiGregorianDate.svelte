<script lang="ts">
    import { enUS, es } from "date-fns/locale";
    import { format } from "date-fns";

    import { GlobalState } from "../model/GlobalState";

    export let value: Date;

    let { i18n } = GlobalState.get();

    const locales: { [key: string]: any } = {
        en: enUS,
        es: es,
    };

    // https://date-fns.org/v3.6.0/docs/format
    export function formatDate(date: Date, i18nLocale: string) {
        const locale = locales[i18nLocale] || locales.en;
        return format(date, "Pp", { locale });
    }
</script>

{formatDate(value, $i18n.language)}
