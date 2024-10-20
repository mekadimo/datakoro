import type { ConceptName } from "$lib/graph/domain/model/ConceptName";
import { ConceptId } from "../../../graph/domain/model/ConceptId";
import { ConceptNotFoundException } from "$lib/shared/domain/model/DomainException";
import { ConceptView } from "./View";
import { ID_DATAKORO_SEARCH } from "../../../graph/domain/model/ConceptId";

interface ViewData {
    readonly results: ConceptId[];
    readonly pageNumber: number;
    readonly numberOfResultsPerPage: number;
    readonly numberOfTotalResults: number;
}

export class DatakoroSearchConceptView extends ConceptView {
    readonly data: ViewData;

    constructor(input: {
        conceptId: ConceptId;
        data: ViewData;
        parameters: { [key: string]: string };
        names: { [conceptIdShort: string]: ConceptName };
    }) {
        if (input.conceptId.shortValue !== ID_DATAKORO_SEARCH.shortValue) {
            throw new ConceptNotFoundException({
                id: input.conceptId.shortValue,
            });
        }

        super({
            conceptId: input.conceptId,
            parameters: input.parameters,
            names: input.names,
        });
        this.data = input.data;
    }
}
