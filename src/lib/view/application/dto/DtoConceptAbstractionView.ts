import type { DtoAbstractionView } from "./DtoView";
import type { DtoActiveRelation } from "$lib/graph/application/dto/DtoActiveRelation";
import type { DtoConcept } from "$lib/graph/application/dto/DtoConcept";
import { ConceptAbstractionView } from "$lib/view/domain/model/ConceptAbstractionView";
import { ConceptId } from "$lib/graph/domain/model/ConceptId";
import { DtoActiveRelationTransformer } from "$lib/graph/application/dto/DtoActiveRelation";
import { DtoConceptNameTransformer } from "$lib/graph/application/dto/DtoConceptName";
import { DtoConceptTransformer } from "$lib/graph/application/dto/DtoConcept";

export interface DtoConceptAbstractionView extends DtoAbstractionView {
    readonly data: {
        readonly concept: DtoConcept;
        readonly conceptRelations: DtoActiveRelation[];
    };
}

export class DtoConceptAbstractionViewTransformer {
    public static fromDomain(
        view: ConceptAbstractionView,
    ): DtoConceptAbstractionView {
        return {
            abstractionId: view.abstractionId.shortValue,
            conceptId: view.conceptId.shortValue,
            data: {
                concept: DtoConceptTransformer.fromDomain(view.data.concept),
                conceptRelations: view.data.conceptRelations.map((r) =>
                    DtoActiveRelationTransformer.fromDomain(r),
                ),
            },
            parameters: view.parameters,
            names: Object.fromEntries(
                Object.entries(view.names).map(
                    ([conceptIdShort, conceptName]) => [
                        conceptIdShort,
                        DtoConceptNameTransformer.fromDomain(conceptName),
                    ],
                ),
            ),
        };
    }

    public static toDomain(
        dto: DtoConceptAbstractionView,
    ): ConceptAbstractionView {
        return new ConceptAbstractionView({
            abstractionId: new ConceptId(dto.abstractionId),
            conceptId: new ConceptId(dto.conceptId),
            data: {
                concept: DtoConceptTransformer.toDomain(dto.data.concept),
                conceptRelations: dto.data.conceptRelations.map((r) =>
                    DtoActiveRelationTransformer.toDomain(r),
                ),
            },
            parameters: dto.parameters,
            names: Object.fromEntries(
                Object.entries(dto.names).map(
                    ([conceptIdShort, dtoConceptName]) => [
                        conceptIdShort,
                        DtoConceptNameTransformer.toDomain(dtoConceptName),
                    ],
                ),
            ),
        });
    }
}
