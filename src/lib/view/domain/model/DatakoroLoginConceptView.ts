import type { ConceptName } from "$lib/graph/domain/model/ConceptName";
import { ConceptId } from "../../../graph/domain/model/ConceptId";
import { ConceptNotFoundException } from "$lib/shared/domain/model/DomainException";
import { ConceptView } from "./View";
import { ID_DATAKORO_LOGIN } from "../../../graph/domain/model/ConceptId";

export class DatakoroLoginConceptView extends ConceptView {
    constructor(input: {
        conceptId: ConceptId;
        parameters: { [key: string]: string };
        names: { [conceptIdShort: string]: ConceptName };
    }) {
        if (input.conceptId.shortValue !== ID_DATAKORO_LOGIN.shortValue) {
            throw new ConceptNotFoundException({
                id: input.conceptId.shortValue,
            });
        }

        super({
            conceptId: input.conceptId,
            parameters: input.parameters,
            names: input.names,
        });
    }
}
