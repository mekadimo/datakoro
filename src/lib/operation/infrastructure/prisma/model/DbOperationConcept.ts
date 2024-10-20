import type { DbDateTimeFilter } from "../../../../shared/infrastructure/prisma/model/DbFilter";
import type { DbFieldOrderDirection } from "../../../../shared/infrastructure/prisma/model/DbFieldOrderDirection";
import type { DbNullableDateTimeFilter } from "../../../../shared/infrastructure/prisma/model/DbFilter";
import type { DbUuidFilter } from "../../../../shared/infrastructure/prisma/model/DbFilter";
import type { OperationConceptFieldOrder } from "../../../domain/model/OperationConcept";
import type { OperationConceptFilter } from "../../../domain/model/OperationConcept";
import { DbModel } from "../../../../shared/infrastructure/prisma/model/DbModel";
import { OperationConcept } from "../../../domain/model/OperationConcept";
import { OperationConceptEndDate } from "../../../domain/model/OperationConcept";
import { OperationConceptField } from "../../../domain/model/OperationConcept";
import { OperationConceptId } from "../../../domain/model/OperationConcept";
import { OperationConceptStartDate } from "../../../domain/model/OperationConcept";
import { OperationConceptUserId } from "../../../domain/model/OperationConcept";

type DbOperationConceptFilter =
    | { concept_id: DbUuidFilter }
    | { end_date: DbNullableDateTimeFilter }
    | { start_date: DbDateTimeFilter }
    | { user_concept_id: DbUuidFilter };

type DbOperationConceptFieldOrder =
    | { concept_id: DbFieldOrderDirection }
    | { end_date: DbFieldOrderDirection }
    | { start_date: DbFieldOrderDirection }
    | { user_concept_id: DbFieldOrderDirection };

export class DbOperationConcept {
    concept_id: string;
    end_date: Date | null;
    start_date: Date;
    user_concept_id: string;

    constructor(input: {
        concept_id: string;
        end_date: Date | null;
        start_date: Date;
        user_concept_id: string;
    }) {
        this.concept_id = input.concept_id;
        this.end_date = input.end_date;
        this.start_date = input.start_date;
        this.user_concept_id = input.user_concept_id;
    }

    public static fromDomain(
        operationConcept: OperationConcept,
    ): DbOperationConcept {
        return new DbOperationConcept({
            concept_id: operationConcept.id.longValue,
            end_date:
                null == operationConcept.endDate
                    ? null
                    : operationConcept.endDate.value,
            start_date: operationConcept.startDate.value,
            user_concept_id: operationConcept.userId.longValue,
        });
    }

    public static toDbFilter(
        filter: OperationConceptFilter,
    ): DbOperationConceptFilter {
        switch (filter.field) {
            case OperationConceptField.Id: {
                return {
                    concept_id: DbModel.toDbUuidFilter(filter.filter),
                };
            }
            case OperationConceptField.EndDate: {
                return {
                    end_date: DbModel.toDbNullableDateTimeFilter(filter.filter),
                };
            }
            case OperationConceptField.StartDate: {
                return {
                    start_date: DbModel.toDbDateTimeFilter(filter.filter),
                };
            }
            case OperationConceptField.UserId: {
                return {
                    user_concept_id: DbModel.toDbUuidFilter(filter.filter),
                };
            }
        }
    }

    public static toDbFilterWhere(filters: OperationConceptFilter[]): {
        AND: DbOperationConceptFilter[];
    } {
        const dbFilters = filters.map((f) => DbOperationConcept.toDbFilter(f));
        return { AND: dbFilters };
    }

    public static toDbOrder(
        order: OperationConceptFieldOrder,
    ): DbOperationConceptFieldOrder {
        switch (order.field) {
            case OperationConceptField.Id: {
                return {
                    concept_id: DbModel.toDbOrderDirection(order.direction),
                };
            }
            case OperationConceptField.EndDate: {
                return {
                    end_date: DbModel.toDbOrderDirection(order.direction),
                };
            }
            case OperationConceptField.StartDate: {
                return {
                    start_date: DbModel.toDbOrderDirection(order.direction),
                };
            }
            case OperationConceptField.UserId: {
                return {
                    user_concept_id: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
        }
    }

    public static toDbOrderBy(
        orderBy: OperationConceptFieldOrder[],
    ): DbOperationConceptFieldOrder[] {
        const dbOrderBy = orderBy.map((o) => DbOperationConcept.toDbOrder(o));
        return dbOrderBy;
    }

    public toDomain(): OperationConcept {
        return new OperationConcept({
            endDate:
                null == this.end_date
                    ? null
                    : new OperationConceptEndDate(this.end_date),
            id: new OperationConceptId(this.concept_id),
            startDate: new OperationConceptStartDate(this.start_date),
            userId: new OperationConceptUserId(this.user_concept_id),
        });
    }
}
