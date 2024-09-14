import { ConceptId } from "./ConceptId";
import { TextValueObject } from "$lib/shared/domain/model/ValueObject";

export class ConceptName {
    readonly languageId: ConceptId | null;
    readonly text: ConceptNameText;

    constructor({
        languageId,
        text,
    }: {
        readonly languageId: ConceptId | null;
        readonly text: ConceptNameText;
    }) {
        this.languageId = languageId;
        this.text = text;
    }
}

export class ConceptNameText extends TextValueObject {
    public get capitalizedValue(): string {
        return this.value[0].toUpperCase() + this.value.slice(1);
    }
}
