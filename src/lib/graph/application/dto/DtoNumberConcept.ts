import { Decimal } from "decimal.js/decimal";

import { NumberConcept } from "../../domain/model/NumberConcept";
import { NumberConceptId } from "../../domain/model/NumberConcept";
import { NumberConceptTransactionDate } from "../../domain/model/NumberConcept";
import { NumberConceptValue } from "../../domain/model/NumberConcept";

export interface DtoNumberConcept {
    readonly id: string;
    readonly transactionDate: Date;
    readonly value: number;
}

export class DtoNumberConceptTransformer {
    public static fromDomain(numberConcept: NumberConcept): DtoNumberConcept {
        return {
            id: numberConcept.id.shortValue,
            transactionDate: numberConcept.transactionDate.value,
            value: numberConcept.value.value.toNumber(),
        };
    }

    public static toDomain(dto: DtoNumberConcept): NumberConcept {
        return new NumberConcept({
            id: new NumberConceptId(dto.id),
            transactionDate: new NumberConceptTransactionDate(
                dto.transactionDate,
            ),
            value: new NumberConceptValue(new Decimal(dto.value)),
        });
    }
}
