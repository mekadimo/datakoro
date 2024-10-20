import type { ActiveRelation } from "$lib/graph/domain/model/Relation";
import type { Concept } from "$lib/graph/domain/model/Concept";
import type { ConceptName } from "$lib/graph/domain/model/ConceptName";
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

    constructor(input: {
        abstractionId: ConceptId;
        conceptId: ConceptId;
        data: ViewData;
        parameters: { [key: string]: string };
        names: { [conceptIdShort: string]: ConceptName };
    }) {
        if (input.abstractionId.shortValue !== ID_CONCEPT.shortValue) {
            throw new ConceptNotFoundException({
                id: input.abstractionId.shortValue,
            });
        }

        super({
            conceptId: input.conceptId,
            abstractionId: input.abstractionId,
            parameters: input.parameters,
            names: input.names,
        });
        this.data = input.data;
    }
}
