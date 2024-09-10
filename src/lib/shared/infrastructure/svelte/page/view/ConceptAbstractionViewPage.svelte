<script lang="ts">
    import type { ConceptAbstractionView } from "../../../../../view/domain/model/ConceptAbstractionView";
    import { AppGlobalState } from "../../model/AppGlobalState";
    import { ID_CONCEPT } from "../../../../../graph/domain/model/ConceptId";

    export let data: ConceptAbstractionView;

    let { i18n } = AppGlobalState.get();
</script>

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
                    <a
                        href={`/${$i18n.language}/view?c=${conceptRelation.abstractionId.shortValue}&a=${ID_CONCEPT.shortValue}`}
                    >
                        <code>
                            {conceptRelation.abstractionId.shortValue}
                        </code>
                    </a>
                </td>
                <td>
                    <a
                        href={`/${$i18n.language}/view?c=${conceptRelation.propertyId.shortValue}&a=${ID_CONCEPT.shortValue}`}
                    >
                        <code>{conceptRelation.propertyId.shortValue}</code>
                    </a>
                </td>
                <td>
                    <code>{conceptRelation.orderNumber.value}</code>
                </td>
                <td>
                    <a
                        href={`/${$i18n.language}/view?c=${conceptRelation.qualityId.shortValue}&a=${ID_CONCEPT.shortValue}`}
                    >
                        <code>{conceptRelation.qualityId.shortValue}</code>
                    </a>
                </td>
                <td>
                    <a
                        href={`/${$i18n.language}/view?c=${conceptRelation.sourceConceptId.shortValue}&a=${ID_CONCEPT.shortValue}`}
                    >
                        <code>
                            {conceptRelation.sourceConceptId.shortValue}
                        </code>
                    </a>
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

<style lang="scss">
</style>
