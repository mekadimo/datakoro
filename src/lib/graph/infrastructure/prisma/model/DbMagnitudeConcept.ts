import type Decimal from "decimal.js";

import { MagnitudeConcept } from "../../../domain/model/MagnitudeConcept";
import { MagnitudeConceptId } from "../../../domain/model/MagnitudeConcept";
import { MagnitudeConceptInterval } from "../../../domain/model/MagnitudeConcept";
import { MagnitudeConceptMagnitudeId } from "../../../domain/model/MagnitudeConcept";
import { MagnitudeConceptTransactionDate } from "../../../domain/model/MagnitudeConcept";

export class DbMagnitudeConcept {
    concept_id: string;
    concept_id_magnitude: string;
    number_range_value: [Decimal | null, Decimal | null];
    transaction_date: Date;

    constructor({
        concept_id,
        concept_id_magnitude,
        number_range_value,
        transaction_date,
    }: {
        concept_id: string;
        concept_id_magnitude: string;
        number_range_value: [Decimal | null, Decimal | null];
        transaction_date: Date;
    }) {
        this.concept_id = concept_id;
        this.concept_id_magnitude = concept_id_magnitude;
        this.number_range_value = number_range_value;
        this.transaction_date = transaction_date;
    }

    public static fromDomain(
        magnitudeConcept: MagnitudeConcept,
    ): DbMagnitudeConcept {
        return new DbMagnitudeConcept({
            concept_id: magnitudeConcept.id.longValue,
            concept_id_magnitude: magnitudeConcept.magnitudeId.longValue,
            number_range_value: magnitudeConcept.interval.value,
            transaction_date: magnitudeConcept.transactionDate.value,
        });
    }

    public toDomain(): MagnitudeConcept {
        return new MagnitudeConcept({
            id: new MagnitudeConceptId(this.concept_id),
            interval: new MagnitudeConceptInterval(this.number_range_value),
            magnitudeId: new MagnitudeConceptMagnitudeId(
                this.concept_id_magnitude,
            ),
            transactionDate: new MagnitudeConceptTransactionDate(
                this.transaction_date,
            ),
        });
    }
}
