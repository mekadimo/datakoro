import type { ConceptName } from "$lib/graph/domain/model/ConceptName";
import { ConceptId } from "../../../graph/domain/model/ConceptId";
import { ConceptNotFoundException } from "$lib/shared/domain/model/DomainException";
import { ID_CONCEPT } from "../../../graph/domain/model/ConceptId";
import { ID_DATAKORO_LOGIN } from "../../../graph/domain/model/ConceptId";
import { ID_DATAKORO_SEARCH } from "../../../graph/domain/model/ConceptId";

const SUPPORTED_ABSTRACTION_VIEW_SHORTVALUES = [ID_CONCEPT.shortValue];
const SUPPORTED_CONCEPT_VIEW_SHORTVALUES = [
    ID_DATAKORO_LOGIN.shortValue,
    ID_DATAKORO_SEARCH.shortValue,
];

export abstract class View {
    readonly conceptId: ConceptId;
    readonly abstractionId: ConceptId | null;
    readonly parameters: { [key: string]: string };
    readonly names: { [conceptIdShort: string]: ConceptName };

    constructor(input: {
        conceptId: ConceptId;
        abstractionId: ConceptId | null;
        parameters: { [key: string]: string };
        names: { [conceptIdShort: string]: ConceptName };
    }) {
        this.conceptId = input.conceptId;
        this.abstractionId = input.abstractionId;
        this.parameters = input.parameters;
        this.names = input.names;
    }

    public getConceptName(conceptId: ConceptId): ConceptName | null {
        if (!Object.hasOwn(this.names, conceptId.shortValue)) {
            return null;
        }
        return this.names[conceptId.shortValue];
    }
}

export abstract class AbstractionView extends View {
    declare readonly abstractionId: ConceptId;

    constructor(input: {
        conceptId: ConceptId;
        abstractionId: ConceptId;
        parameters: { [key: string]: string };
        names: { [conceptIdShort: string]: ConceptName };
    }) {
        AbstractionView.assertIsSupported(input.abstractionId);
        super({
            conceptId: input.conceptId,
            abstractionId: input.abstractionId,
            parameters: input.parameters,
            names: input.names,
        });
    }

    private static assertIsSupported(abstractionId: ConceptId) {
        if (
            !SUPPORTED_ABSTRACTION_VIEW_SHORTVALUES.includes(
                abstractionId.shortValue,
            )
        ) {
            throw new ConceptNotFoundException({
                id: abstractionId.shortValue,
            });
        }
    }
}

export abstract class ConceptView extends View {
    declare readonly abstractionId: null;

    constructor(input: {
        conceptId: ConceptId;
        parameters: { [key: string]: string };
        names: { [conceptIdShort: string]: ConceptName };
    }) {
        ConceptView.assertIsSupported(input.conceptId);
        super({
            conceptId: input.conceptId,
            abstractionId: null,
            parameters: input.parameters,
            names: input.names,
        });
    }

    private static assertIsSupported(conceptId: ConceptId) {
        if (
            !SUPPORTED_CONCEPT_VIEW_SHORTVALUES.includes(conceptId.shortValue)
        ) {
            throw new ConceptNotFoundException({
                id: conceptId.shortValue,
            });
        }
    }
}
