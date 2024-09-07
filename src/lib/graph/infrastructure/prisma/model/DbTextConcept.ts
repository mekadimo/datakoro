import type { DbDateTimeFilter } from "../../../../shared/infrastructure/prisma/model/DbFilter";
import type { DbFieldOrderDirection } from "../../../../shared/infrastructure/prisma/model/DbFieldOrderDirection";
import type { DbTextFilter } from "../../../../shared/infrastructure/prisma/model/DbFilter";
import type { DbUuidFilter } from "../../../../shared/infrastructure/prisma/model/DbFilter";
import type { TextConceptFieldOrder } from "../../../domain/model/TextConcept";
import type { TextConceptFilter } from "../../../domain/model/TextConcept";
import { DbModel } from "../../../../shared/infrastructure/prisma/model/DbModel";
import { TextConcept } from "../../../domain/model/TextConcept";
import { TextConceptField } from "../../../domain/model/TextConcept";
import { TextConceptId } from "../../../domain/model/TextConcept";
import { TextConceptTransactionDate } from "../../../domain/model/TextConcept";
import { TextConceptValue } from "../../../domain/model/TextConcept";

type DbTextConceptFilter =
    | { concept_id: DbUuidFilter }
    | { transaction_date: DbDateTimeFilter }
    | { text_value: DbTextFilter };

type DbTextConceptFieldOrder =
    | { concept_id: DbFieldOrderDirection }
    | { transaction_date: DbFieldOrderDirection }
    | { text_value: DbFieldOrderDirection };

export class DbTextConcept {
    concept_id: string;
    text_value: string;
    transaction_date: Date;

    constructor({
        concept_id,
        text_value,
        transaction_date,
    }: {
        concept_id: string;
        text_value: string;
        transaction_date: Date;
    }) {
        this.concept_id = concept_id;
        this.text_value = text_value;
        this.transaction_date = transaction_date;
    }

    public static fromDomain(textConcept: TextConcept): DbTextConcept {
        return new DbTextConcept({
            concept_id: textConcept.id.longValue,
            text_value: textConcept.value.value,
            transaction_date: textConcept.transactionDate.value,
        });
    }

    public static toDbFilter(filter: TextConceptFilter): DbTextConceptFilter {
        switch (filter.field) {
            case TextConceptField.Id: {
                return {
                    concept_id: DbModel.toDbUuidFilter(filter.filter),
                };
            }
            case TextConceptField.TransactionDate: {
                return {
                    transaction_date: DbModel.toDbDateTimeFilter(filter.filter),
                };
            }
            case TextConceptField.Value: {
                return {
                    text_value: DbModel.toDbTextFilter(filter.filter),
                };
            }
        }
    }

    public static toDbFilterWhere(filters: TextConceptFilter[]): {
        AND: DbTextConceptFilter[];
    } {
        const dbFilters = filters.map((f) => DbTextConcept.toDbFilter(f));
        return { AND: dbFilters };
    }

    public static toDbOrder(
        order: TextConceptFieldOrder,
    ): DbTextConceptFieldOrder {
        switch (order.field) {
            case TextConceptField.Id: {
                return {
                    concept_id: DbModel.toDbOrderDirection(order.direction),
                };
            }
            case TextConceptField.TransactionDate: {
                return {
                    transaction_date: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case TextConceptField.Value: {
                return {
                    text_value: DbModel.toDbOrderDirection(order.direction),
                };
            }
        }
    }

    public static toDbOrderBy(
        orderBy: TextConceptFieldOrder[],
    ): DbTextConceptFieldOrder[] {
        const dbOrderBy = orderBy.map((o) => DbTextConcept.toDbOrder(o));
        return dbOrderBy;
    }

    public toDomain(): TextConcept {
        return new TextConcept({
            id: new TextConceptId(this.concept_id),
            transactionDate: new TextConceptTransactionDate(
                this.transaction_date,
            ),
            value: new TextConceptValue(this.text_value),
        });
    }
}
