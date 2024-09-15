import type { DtoConceptView } from "./DtoView";
import { ConceptId } from "$lib/graph/domain/model/ConceptId";
import { DatakoroSearchConceptView } from "$lib/view/domain/model/DatakoroSearchConceptView";
import { DtoConceptNameTransformer } from "$lib/graph/application/dto/DtoConceptName";

export interface DtoDatakoroSearchConceptView extends DtoConceptView {
    readonly data: {
        readonly numberOfResultsPerPage: number;
        readonly numberOfTotalResults: number;
        readonly pageNumber: number;
        readonly results: string[];
    };
}

export class DtoDatakoroSearchConceptViewTransformer {
    public static fromDomain(
        view: DatakoroSearchConceptView,
    ): DtoDatakoroSearchConceptView {
        return {
            conceptId: view.conceptId.shortValue,
            abstractionId: null,
            data: {
                numberOfResultsPerPage: view.data.numberOfResultsPerPage,
                numberOfTotalResults: view.data.numberOfTotalResults,
                pageNumber: view.data.pageNumber,
                results: view.data.results.map((r) => r.shortValue),
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
        dto: DtoDatakoroSearchConceptView,
    ): DatakoroSearchConceptView {
        return new DatakoroSearchConceptView({
            conceptId: new ConceptId(dto.conceptId),
            data: {
                numberOfResultsPerPage: dto.data.numberOfResultsPerPage,
                numberOfTotalResults: dto.data.numberOfTotalResults,
                pageNumber: dto.data.pageNumber,
                results: dto.data.results.map((r) => new ConceptId(r)),
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
