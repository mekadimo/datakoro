import { ConceptId } from "$lib/graph/domain/model/ConceptId";
import { ConceptName } from "$lib/graph/domain/model/ConceptName";
import { ConceptNameText } from "$lib/graph/domain/model/ConceptName";

export interface DtoConceptName {
    readonly languageId: string | null;
    readonly text: string;
}

export class DtoConceptNameTransformer {
    public static fromDomain(conceptName: ConceptName): DtoConceptName {
        return {
            languageId:
                null == conceptName.languageId
                    ? null
                    : conceptName.languageId.shortValue,
            text: conceptName.text.value,
        };
    }

    public static toDomain(dto: DtoConceptName): ConceptName {
        return new ConceptName({
            languageId:
                null == dto.languageId ? null : new ConceptId(dto.languageId),
            text: new ConceptNameText(dto.text),
        });
    }
}
