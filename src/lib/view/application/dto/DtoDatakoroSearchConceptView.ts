import type { DtoConcept } from "$lib/graph/application/dto/DtoConcept";
import type { DtoConceptView } from "./DtoView";
import { ConceptId } from "$lib/graph/domain/model/ConceptId";
import { DatakoroSearchConceptView } from "$lib/view/domain/model/DatakoroSearchConceptView";
import { DtoConceptTransformer } from "$lib/graph/application/dto/DtoConcept";

export interface DtoDatakoroSearchConceptView extends DtoConceptView {
    readonly data: {
        readonly numberOfResultsPerPage: number;
        readonly numberOfTotalResults: number;
        readonly pageNumber: number;
        readonly results: {
            readonly concept: DtoConcept;
            readonly abstractions: DtoConcept[];
        }[];
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
                results: view.data.results.map((result) => {
                    return {
                        concept: DtoConceptTransformer.fromDomain(
                            result.concept,
                        ),
                        abstractions: result.abstractions.map((a) =>
                            DtoConceptTransformer.fromDomain(a),
                        ),
                    };
                }),
            },
            parameters: view.parameters,
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
                results: dto.data.results.map((result) => {
                    return {
                        concept: DtoConceptTransformer.toDomain(result.concept),
                        abstractions: result.abstractions.map((a) =>
                            DtoConceptTransformer.toDomain(a),
                        ),
                    };
                }),
            },
            parameters: dto.parameters,
        });
    }
}
