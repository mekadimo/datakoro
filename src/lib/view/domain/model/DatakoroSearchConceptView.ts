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

    constructor({
        conceptId,
        data,
        parameters,
        names,
    }: {
        conceptId: ConceptId;
        data: ViewData;
        parameters: { [key: string]: string };
        names: { [conceptIdShort: string]: ConceptName };
    }) {
        if (conceptId.shortValue !== ID_DATAKORO_SEARCH.shortValue) {
            throw new ConceptNotFoundException({
                id: conceptId.shortValue,
            });
        }

        super({
            conceptId: conceptId,
            parameters: parameters,
            names: names,
        });
        this.data = data;
    }
}
