import type { ActiveRelation } from "$lib/graph/domain/model/Relation";
import type { Concept } from "$lib/graph/domain/model/Concept";
import { AbstractionView } from "./View";
import { ConceptId } from "../../../graph/domain/model/ConceptId";
import { ConceptNotFoundException } from "$lib/shared/domain/model/DomainException";
import { ID_CONCEPT } from "../../../graph/domain/model/ConceptId";

interface ViewData {
    readonly concept: Concept;
    readonly conceptRelations: ActiveRelation[];
}

export class ConceptAbstractionView extends AbstractionView {
    readonly data: ViewData;

    constructor({
        abstractionId,
        conceptId,
        data,
        parameters,
    }: {
        abstractionId: ConceptId;
        conceptId: ConceptId;
        data: ViewData;
        parameters: { [key: string]: string };
    }) {
        if (abstractionId.shortValue !== ID_CONCEPT.shortValue) {
            throw new ConceptNotFoundException({
                id: abstractionId.shortValue,
            });
        }

        super({
            conceptId: conceptId,
            abstractionId: abstractionId,
            parameters: parameters,
        });
        this.data = data;
    }
}
