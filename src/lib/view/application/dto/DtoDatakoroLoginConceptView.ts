import type { DtoConceptView } from "./DtoView";
import { ConceptId } from "$lib/graph/domain/model/ConceptId";
import { DatakoroLoginConceptView } from "$lib/view/domain/model/DatakoroLoginConceptView";
import { DtoConceptNameTransformer } from "$lib/graph/application/dto/DtoConceptName";

export type DtoDatakoroLoginConceptView = DtoConceptView;

export class DtoDatakoroLoginConceptViewTransformer {
    public static fromDomain(
        view: DatakoroLoginConceptView,
    ): DtoDatakoroLoginConceptView {
        return {
            conceptId: view.conceptId.shortValue,
            abstractionId: null,
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
        dto: DtoDatakoroLoginConceptView,
    ): DatakoroLoginConceptView {
        return new DatakoroLoginConceptView({
            conceptId: new ConceptId(dto.conceptId),
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
