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

    constructor({
        conceptId,
        abstractionId,
        parameters,
    }: {
        conceptId: ConceptId;
        abstractionId: ConceptId | null;
        parameters: { [key: string]: string };
    }) {
        this.conceptId = conceptId;
        this.abstractionId = abstractionId;
        this.parameters = parameters;
    }
}

export abstract class AbstractionView extends View {
    declare readonly abstractionId: ConceptId;

    constructor({
        conceptId,
        abstractionId,
        parameters,
    }: {
        conceptId: ConceptId;
        abstractionId: ConceptId;
        parameters: { [key: string]: string };
    }) {
        AbstractionView.assertIsSupported(abstractionId);
        super({
            conceptId: conceptId,
            abstractionId: abstractionId,
            parameters: parameters,
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

    constructor({
        conceptId,
        parameters,
    }: {
        conceptId: ConceptId;
        parameters: { [key: string]: string };
    }) {
        ConceptView.assertIsSupported(conceptId);
        super({
            conceptId: conceptId,
            abstractionId: null,
            parameters: parameters,
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
