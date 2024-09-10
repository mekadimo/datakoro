import { ConceptId } from "../../domain/model/ConceptId";
import { ConceptOperationId } from "../../domain/model/Concept";
import { ConceptTransactionDate } from "../../domain/model/Concept";
import { ConceptTransactionId } from "../../domain/model/Concept";
import { Concept } from "../../domain/model/Concept";

export interface DtoConcept {
    readonly id: string;
    readonly operationId: string;
    readonly transactionDate: Date;
    readonly transactionId: string;
}

export class DtoConceptTransformer {
    public static fromDomain(concept: Concept): DtoConcept {
        return {
            id: concept.id.shortValue,
            operationId: concept.operationId.shortValue,
            transactionDate: concept.transactionDate.value,
            transactionId: concept.transactionId.shortValue,
        };
    }

    public static toDomain(dto: DtoConcept): Concept {
        return new Concept({
            id: new ConceptId(dto.id),
            operationId: new ConceptOperationId(dto.operationId),
            transactionDate: new ConceptTransactionDate(dto.transactionDate),
            transactionId: new ConceptTransactionId(dto.transactionId),
        });
    }
}
