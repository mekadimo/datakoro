import type { Decimal } from "decimal.js/decimal";

import type { DbFieldOrderDirection } from "../../../../shared/infrastructure/prisma/model/DbFieldOrderDirection";
import type { NumberConceptFieldOrder } from "../../../domain/model/NumberConcept";
import type { NumberConceptFilter } from "../../../domain/model/NumberConcept";
import type { DbDateTimeFilter } from "../../../../shared/infrastructure/prisma/model/DbFilter";
import type { DbDecimalNumberFilter } from "../../../../shared/infrastructure/prisma/model/DbFilter";
import type { DbUuidFilter } from "../../../../shared/infrastructure/prisma/model/DbFilter";
import { NumberConcept } from "../../../domain/model/NumberConcept";
import { NumberConceptField } from "../../../domain/model/NumberConcept";
import { DbModel } from "../../../../shared/infrastructure/prisma/model/DbModel";
import { NumberConceptId } from "../../../domain/model/NumberConcept";
import { NumberConceptTransactionDate } from "../../../domain/model/NumberConcept";
import { NumberConceptValue } from "../../../domain/model/NumberConcept";

type DbNumberConceptFilter =
    | { concept_id: DbUuidFilter }
    | { transaction_date: DbDateTimeFilter }
    | { number_value: DbDecimalNumberFilter };

type DbNumberConceptFieldOrder =
    | { concept_id: DbFieldOrderDirection }
    | { transaction_date: DbFieldOrderDirection }
    | { number_value: DbFieldOrderDirection };

export class DbNumberConcept {
    concept_id: string;
    number_value: Decimal;
    transaction_date: Date;

    constructor(input: {
        concept_id: string;
        number_value: Decimal;
        transaction_date: Date;
    }) {
        this.concept_id = input.concept_id;
        this.number_value = input.number_value;
        this.transaction_date = input.transaction_date;
    }

    public static fromDomain(numberConcept: NumberConcept): DbNumberConcept {
        return new DbNumberConcept({
            concept_id: numberConcept.id.longValue,
            number_value: numberConcept.value.value,
            transaction_date: numberConcept.transactionDate.value,
        });
    }

    public static toDbFilter(
        filter: NumberConceptFilter,
    ): DbNumberConceptFilter {
        switch (filter.field) {
            case NumberConceptField.Id: {
                return {
                    concept_id: DbModel.toDbUuidFilter(filter.filter),
                };
            }
            case NumberConceptField.TransactionDate: {
                return {
                    transaction_date: DbModel.toDbDateTimeFilter(filter.filter),
                };
            }
            case NumberConceptField.Value: {
                return {
                    number_value: DbModel.toDbDecimalNumberFilter(
                        filter.filter,
                    ),
                };
            }
        }
    }

    public static toDbFilterWhere(filters: NumberConceptFilter[]): {
        AND: DbNumberConceptFilter[];
    } {
        const dbFilters = filters.map((f) => DbNumberConcept.toDbFilter(f));
        return { AND: dbFilters };
    }

    public static toDbOrder(
        order: NumberConceptFieldOrder,
    ): DbNumberConceptFieldOrder {
        switch (order.field) {
            case NumberConceptField.Id: {
                return {
                    concept_id: DbModel.toDbOrderDirection(order.direction),
                };
            }
            case NumberConceptField.TransactionDate: {
                return {
                    transaction_date: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case NumberConceptField.Value: {
                return {
                    number_value: DbModel.toDbOrderDirection(order.direction),
                };
            }
        }
    }

    public static toDbOrderBy(
        orderBy: NumberConceptFieldOrder[],
    ): DbNumberConceptFieldOrder[] {
        const dbOrderBy = orderBy.map((o) => DbNumberConcept.toDbOrder(o));
        return dbOrderBy;
    }

    public toDomain(): NumberConcept {
        return new NumberConcept({
            id: new NumberConceptId(this.concept_id),
            transactionDate: new NumberConceptTransactionDate(
                this.transaction_date,
            ),
            value: new NumberConceptValue(this.number_value),
        });
    }
}
