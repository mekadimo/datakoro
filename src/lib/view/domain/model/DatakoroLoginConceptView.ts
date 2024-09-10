import { ConceptId } from "../../../graph/domain/model/ConceptId";
import { ConceptNotFoundException } from "$lib/shared/domain/model/DomainException";
import { ConceptView } from "./View";
import { ID_DATAKORO_LOGIN } from "../../../graph/domain/model/ConceptId";

export class DatakoroLoginConceptView extends ConceptView {
    constructor({
        conceptId,
        parameters,
    }: {
        conceptId: ConceptId;
        parameters: { [key: string]: string };
    }) {
        if (conceptId.shortValue !== ID_DATAKORO_LOGIN.shortValue) {
            throw new ConceptNotFoundException({
                id: conceptId.shortValue,
            });
        }

        super({
            conceptId: conceptId,
            parameters: parameters,
        });
    }
}
