import type { DtoConceptView } from "./DtoView";
import { DatakoroLoginConceptView } from "$lib/view/domain/model/DatakoroLoginConceptView";
import { ConceptId } from "$lib/graph/domain/model/ConceptId";

export type DtoDatakoroLoginConceptView = DtoConceptView;

export class DtoDatakoroLoginConceptViewTransformer {
    public static fromDomain(
        view: DatakoroLoginConceptView,
    ): DtoDatakoroLoginConceptView {
        return {
            conceptId: view.conceptId.shortValue,
            abstractionId: null,
            parameters: view.parameters,
        };
    }

    public static toDomain(
        dto: DtoDatakoroLoginConceptView,
    ): DatakoroLoginConceptView {
        return new DatakoroLoginConceptView({
            conceptId: new ConceptId(dto.conceptId),
            parameters: dto.parameters,
        });
    }
}
