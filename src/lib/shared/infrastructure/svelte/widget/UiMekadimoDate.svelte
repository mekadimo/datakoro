<script lang="ts">
    import { GlobalState } from "../model/GlobalState";
    import type { MekadimoDate } from "$lib/shared/domain/model/MekadimoDate";

    export let value: MekadimoDate;

    let { i18n } = GlobalState.get();

    let planatoName: string;
    let uiDate: string;

    $: {
        if (1 === value.planato) {
            planatoName = $i18n.t("printuno");
        } else if (2 === value.planato) {
            planatoName = $i18n.t("sometro");
        } else if (3 === value.planato) {
            planatoName = $i18n.t("awtempo");
        } else if (4 === value.planato) {
            planatoName = $i18n.t("vinro");
        }

        if (91 === value.day && 2 === value.planato) {
            uiDate = $i18n.t("mekadimo_date_datakoro_day_format", {
                year: value.year,
            });
        } else if (91 === value.day && 4 === value.planato) {
            uiDate = $i18n.t("mekadimo_date_mekadimo_day_format", {
                year: value.year,
            });
        } else {
            uiDate = $i18n.t("mekadimo_date_planato_format", {
                day: value.day,
                planato: planatoName,
                year: value.year,
            });
        }
    }
</script>

{uiDate}
