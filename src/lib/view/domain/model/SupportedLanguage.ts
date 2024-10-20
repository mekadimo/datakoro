import { ConceptId } from "$lib/graph/domain/model/ConceptId";
import { ID_LANGUAGE_ENGLISH } from "$lib/graph/domain/model/ConceptId";
import { ID_LANGUAGE_SPANISH } from "$lib/graph/domain/model/ConceptId";
import { LanguageCodeNotSupportedException } from "$lib/shared/domain/model/DomainException";
import { TextValueObject } from "$lib/shared/domain/model/ValueObject";

export class SupportedLanguage {
    readonly code: SupportedLanguageCode;
    readonly conceptId: SupportedLanguageConceptId;
    readonly originalName: SupportedLanguageOriginalName;

    constructor(input: {
        code: SupportedLanguageCode;
        conceptId: SupportedLanguageConceptId;
        originalName: SupportedLanguageOriginalName;
    }) {
        this.code = input.code;
        this.conceptId = input.conceptId;
        this.originalName = input.originalName;
    }
}

export class SupportedLanguageCode extends TextValueObject {}

export class SupportedLanguageConceptId extends ConceptId {}

export class SupportedLanguageOriginalName extends TextValueObject {}

export const SUPPORTED_LANGUAGES = [
    new SupportedLanguage({
        code: new SupportedLanguageCode("en"),
        conceptId: ID_LANGUAGE_ENGLISH,
        originalName: new SupportedLanguageOriginalName("English"),
    }),
    new SupportedLanguage({
        code: new SupportedLanguageCode("es"),
        conceptId: ID_LANGUAGE_SPANISH,
        originalName: new SupportedLanguageOriginalName("Español"),
    }),
];

export function languageCodeToConceptId(languageCode: string): ConceptId {
    for (const supportedLanguage of SUPPORTED_LANGUAGES) {
        if (supportedLanguage.code.value === languageCode) {
            return supportedLanguage.conceptId;
        }
    }
    throw new LanguageCodeNotSupportedException({ languageCode: languageCode });
}
