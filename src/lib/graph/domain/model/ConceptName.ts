import { ConceptId } from "./ConceptId";
import { TextValueObject } from "$lib/shared/domain/model/ValueObject";

export class ConceptName {
    readonly languageId: ConceptId | null;
    readonly text: ConceptNameText;

    constructor(input: {
        readonly languageId: ConceptId | null;
        readonly text: ConceptNameText;
    }) {
        this.languageId = input.languageId;
        this.text = input.text;
    }
}

export class ConceptNameText extends TextValueObject {
    public get capitalizedValue(): string {
        return this.value[0].toUpperCase() + this.value.slice(1);
    }
}
