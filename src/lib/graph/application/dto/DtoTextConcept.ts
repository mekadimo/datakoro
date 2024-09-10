import { TextConcept } from "../../domain/model/TextConcept";
import { TextConceptId } from "../../domain/model/TextConcept";
import { TextConceptTransactionDate } from "../../domain/model/TextConcept";
import { TextConceptValue } from "../../domain/model/TextConcept";

export interface DtoTextConcept {
    readonly id: string;
    readonly transactionDate: Date;
    readonly value: string;
}

export class DtoTextConceptTransformer {
    public static fromDomain(textConcept: TextConcept): DtoTextConcept {
        return {
            id: textConcept.id.shortValue,
            transactionDate: textConcept.transactionDate.value,
            value: textConcept.value.value,
        };
    }

    public static toDomain(dto: DtoTextConcept): TextConcept {
        return new TextConcept({
            id: new TextConceptId(dto.id),
            transactionDate: new TextConceptTransactionDate(
                dto.transactionDate,
            ),
            value: new TextConceptValue(dto.value),
        });
    }
}
