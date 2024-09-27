<script lang="ts">
    import ConceptUiName from "$lib/graph/infrastructure/svelte/widget/ConceptUiName.svelte";
    import UiGregorianDate from "$lib/shared/infrastructure/svelte/widget/UiGregorianDate.svelte";
    import UiMekadimoDate from "$lib/shared/infrastructure/svelte/widget/UiMekadimoDate.svelte";
    import ViewHyperlink from "$lib/shared/infrastructure/svelte/widget/ViewHyperlink.svelte";
    import type { ConceptAbstractionView } from "$lib/view/domain/model/ConceptAbstractionView";
    import type { View } from "$lib/view/domain/model/View";
    import { ConceptId } from "$lib/graph/domain/model/ConceptId";
    import { GlobalState } from "$lib/shared/infrastructure/svelte/model/GlobalState";
    import { ID_CONCEPT } from "$lib/graph/domain/model/ConceptId";

    export let data: ConceptAbstractionView;

    let { currentViewAbstractionName, currentViewConceptName, i18n } =
        GlobalState.get();

    function getConceptName(conceptId: ConceptId, view: View): string {
        const nameText =
            view.getConceptName(conceptId)?.text.capitalizedValue ??
            $i18n.t("unknown_concept_name", {
                id: conceptId.shortValue,
            });
        return nameText;
    }

    $: currentViewAbstractionName.set(getConceptName(data.abstractionId, data));
    $: currentViewConceptName.set(getConceptName(data.conceptId, data));
</script>

<section class="container datakoro-normal-view">
    <div class="card mt-4">
        <div class="card-content">
            <div class="content">
                <ul>
                    <li>
                        <b>{$i18n.t("operation")}:</b>
                        <code>
                            <ViewHyperlink
                                params={{
                                    c: data.data.concept.operationId.shortValue,
                                    a: ID_CONCEPT.shortValue,
                                }}
                            >
                                <ConceptUiName
                                    conceptId={data.data.concept.operationId}
                                    view={data}
                                />
                            </ViewHyperlink>
                        </code>
                    </li>
                    <li>
                        <b>{$i18n.t("transaction")}:</b>
                        <code>
                            <ViewHyperlink
                                params={{
                                    c: data.data.concept.transactionId
                                        .shortValue,
                                    a: ID_CONCEPT.shortValue,
                                }}
                            >
                                <ConceptUiName
                                    conceptId={data.data.concept.transactionId}
                                    view={data}
                                />
                            </ViewHyperlink>
                        </code>
                    </li>
                    <li>
                        <b>{$i18n.t("mekadimo_date")}:</b>
                        <UiMekadimoDate
                            value={data.data.concept.transactionDate
                                .mekadimoDate}
                        />
                    </li>
                    <li>
                        <b>{$i18n.t("gregorian_date")}:</b>
                        <UiGregorianDate
                            value={data.data.concept.transactionDate.value}
                        />
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <table class="table mb-6">
        <thead>
            <th>{$i18n.t("relation").toUpperCase()}</th>
            <th>{$i18n.t("abstraction").toUpperCase()}</th>
            <th>{$i18n.t("property").toUpperCase()}</th>
            <th>{$i18n.t("order_k_number").toUpperCase()}</th>
            <th>{$i18n.t("quality").toUpperCase()}</th>
            <th>{$i18n.t("origin_concept").toUpperCase()}</th>
            <th>{$i18n.t("origin_relation").toUpperCase()}</th>
        </thead>
        <tbody>
            {#each data.data.conceptRelations as conceptRelation}
                <tr>
                    <td>
                        <code>
                            {conceptRelation.id.shortValue}
                        </code>
                    </td>
                    <td>
                        <ViewHyperlink
                            params={{
                                c: conceptRelation.abstractionId.shortValue,
                                a: ID_CONCEPT.shortValue,
                            }}
                        >
                            <code>
                                <ConceptUiName
                                    conceptId={conceptRelation.abstractionId}
                                    view={data}
                                />
                            </code>
                        </ViewHyperlink>
                    </td>
                    <td>
                        <ViewHyperlink
                            params={{
                                c: conceptRelation.propertyId.shortValue,
                                a: ID_CONCEPT.shortValue,
                            }}
                        >
                            <code>
                                <ConceptUiName
                                    conceptId={conceptRelation.propertyId}
                                    view={data}
                                />
                            </code>
                        </ViewHyperlink>
                    </td>
                    <td>
                        <code>
                            {conceptRelation.orderNumber.value}
                        </code>
                    </td>
                    <td>
                        <ViewHyperlink
                            params={{
                                c: conceptRelation.qualityId.shortValue,
                                a: ID_CONCEPT.shortValue,
                            }}
                        >
                            <code>
                                <ConceptUiName
                                    conceptId={conceptRelation.qualityId}
                                    view={data}
                                />
                            </code>
                        </ViewHyperlink>
                    </td>
                    <td>
                        <ViewHyperlink
                            params={{
                                c: conceptRelation.sourceConceptId.shortValue,
                                a: ID_CONCEPT.shortValue,
                            }}
                        >
                            <code>
                                <ConceptUiName
                                    conceptId={conceptRelation.sourceConceptId}
                                    view={data}
                                />
                            </code>
                        </ViewHyperlink>
                    </td>
                    <td>
                        <code>
                            {conceptRelation.sourceRelationId.shortValue}
                        </code>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</section>

<style lang="scss">
    .card {
        border: solid #eee 1px;
    }

    .table {
        width: 100%;
    }
</style>
