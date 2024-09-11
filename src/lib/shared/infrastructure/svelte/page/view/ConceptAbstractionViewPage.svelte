<script lang="ts">
    import ViewHyperlink from "../../widget/ViewHyperlink.svelte";
    import type { ConceptAbstractionView } from "../../../../../view/domain/model/ConceptAbstractionView";
    import { AppGlobalState } from "../../model/AppGlobalState";
    import { ID_CONCEPT } from "../../../../../graph/domain/model/ConceptId";

    export let data: ConceptAbstractionView;

    let { i18n } = AppGlobalState.get();
</script>

<section class="datakoro-normal-view">
    <ul>
        <li><b>ID:</b> {data.data.concept.id.shortValue}</li>
        <li><b>Operation ID:</b> {data.data.concept.operationId.shortValue}</li>
        <li>
            <b>Transaction ID:</b>
            {data.data.concept.transactionId.shortValue}
        </li>
        <li><b>Date:</b> {data.data.concept.transactionDate.value}</li>
    </ul>
    <table class="table">
        <thead>
            <th>ABSTRACTION</th>
            <th>PROPERTY</th>
            <th>NUMBER</th>
            <th>QUALITY</th>
            <th>SOURCE(C)</th>
            <th>SOURCE(R)</th>
        </thead>
        <tbody>
            {#each data.data.conceptRelations as conceptRelation}
                <tr>
                    <td>
                        <ViewHyperlink
                            params={{
                                c: conceptRelation.abstractionId.shortValue,
                                a: ID_CONCEPT.shortValue,
                            }}
                        >
                            <code>
                                {conceptRelation.abstractionId.shortValue}
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
                            <code>{conceptRelation.propertyId.shortValue}</code>
                        </ViewHyperlink>
                    </td>
                    <td>
                        <code>{conceptRelation.orderNumber.value}</code>
                    </td>
                    <td>
                        <ViewHyperlink
                            params={{
                                c: conceptRelation.qualityId.shortValue,
                                a: ID_CONCEPT.shortValue,
                            }}
                        >
                            <code>{conceptRelation.qualityId.shortValue}</code>
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
                                {conceptRelation.sourceConceptId.shortValue}
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
</style>
