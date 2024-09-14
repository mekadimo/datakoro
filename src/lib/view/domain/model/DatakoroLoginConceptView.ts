import type { ConceptName } from "$lib/graph/domain/model/ConceptName";
import { ConceptId } from "../../../graph/domain/model/ConceptId";
import { ConceptNotFoundException } from "$lib/shared/domain/model/DomainException";
import { ConceptView } from "./View";
import { ID_DATAKORO_LOGIN } from "../../../graph/domain/model/ConceptId";

export class DatakoroLoginConceptView extends ConceptView {
    constructor({
        conceptId,
        parameters,
        names,
    }: {
        conceptId: ConceptId;
        parameters: { [key: string]: string };
        names: { [conceptIdShort: string]: ConceptName };
    }) {
        if (conceptId.shortValue !== ID_DATAKORO_LOGIN.shortValue) {
            throw new ConceptNotFoundException({
                id: conceptId.shortValue,
            });
        }

        super({
            conceptId: conceptId,
            parameters: parameters,
            names: names,
        });
    }
}
