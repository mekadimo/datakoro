<script lang="ts">
    import { enUS, es } from "date-fns/locale";
    import { format } from "date-fns";

    import type { DateTimeValueObject } from "$lib/shared/domain/model/ValueObject";
    import { GlobalState } from "../model/GlobalState";

    export let showNames: boolean = false;
    export let showTime: boolean = true;
    export let mekadimo: boolean = false;
    export let value: DateTimeValueObject;

    let { i18n } = GlobalState.get();

    let planatoName: string;
    let uiDate: string;

    const locales: { [key: string]: any } = {
        en: enUS,
        es: es,
    };

    // https://date-fns.org/v3.6.0/docs/format
    function formatGregorianDate(date: Date, i18nLocale: string): string {
        const locale = locales[i18nLocale] || locales.en;
        return format(date, "Pp", { locale });
    }

    $: {
        if (mekadimo) {
            const mekadimoDate = value.mekadimoDate;

            if (showNames) {
                if (1 === mekadimoDate.planato) {
                    planatoName = $i18n.t("printuno");
                } else if (2 === mekadimoDate.planato) {
                    planatoName = $i18n.t("sometro");
                } else if (3 === mekadimoDate.planato) {
                    planatoName = $i18n.t("awtempo");
                } else if (4 === mekadimoDate.planato) {
                    planatoName = $i18n.t("vinro");
                }

                if (91 === mekadimoDate.day && 2 === mekadimoDate.planato) {
                    uiDate = $i18n.t("mekadimo_date_datakoro_day_format", {
                        year: mekadimoDate.year,
                    });
                } else if (
                    91 === mekadimoDate.day &&
                    4 === mekadimoDate.planato
                ) {
                    uiDate = $i18n.t("mekadimo_date_mekadimo_day_format", {
                        year: mekadimoDate.year,
                    });
                } else {
                    uiDate = $i18n.t("mekadimo_date_planato_format", {
                        day: mekadimoDate.day,
                        planato: planatoName,
                        year: mekadimoDate.year,
                    });
                }
            } else {
                uiDate = `${mekadimoDate.year}/${mekadimoDate.planato}/${mekadimoDate.day}`;
            }

            if (showTime) {
                const gregorianDateFormatted = formatGregorianDate(
                    value.value,
                    $i18n.language,
                );
                uiDate += "," + gregorianDateFormatted.split(",").reverse()[0];
            }
        } else {
            const gregorianDateFormatted = formatGregorianDate(
                value.value,
                $i18n.language,
            );
            uiDate = gregorianDateFormatted;
        }
    }
</script>

{uiDate}
