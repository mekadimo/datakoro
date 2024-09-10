import { ConceptId } from "../../../graph/domain/model/ConceptId";
import { ConceptNotFoundException } from "$lib/shared/domain/model/DomainException";
import { ConceptView } from "./View";
import { ID_DATAKORO_SEARCH } from "../../../graph/domain/model/ConceptId";
import type { Concept } from "$lib/graph/domain/model/Concept";

interface ViewData {
    readonly results: {
        concept: Concept;
        abstractions: Concept[];
    }[];
    readonly pageNumber: number;
    readonly numberOfResultsPerPage: number;
    readonly numberOfTotalResults: number;
}

export class DatakoroSearchConceptView extends ConceptView {
    readonly data: ViewData;

    constructor({
        conceptId,
        data,
        parameters,
    }: {
        conceptId: ConceptId;
        data: ViewData;
        parameters: { [key: string]: string };
    }) {
        if (conceptId.shortValue !== ID_DATAKORO_SEARCH.shortValue) {
            throw new ConceptNotFoundException({
                id: conceptId.shortValue,
            });
        }

        super({
            conceptId: conceptId,
            parameters: parameters,
        });
        this.data = data;
    }
}
