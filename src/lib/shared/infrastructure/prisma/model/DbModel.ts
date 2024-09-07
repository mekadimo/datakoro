import type { BooleanFilter } from "../../../../shared/domain/model/Filter";
import type { DateTimeFilter } from "../../../../shared/domain/model/Filter";
import type { DbBooleanFilter } from "../../../../shared/infrastructure/prisma/model/DbFilter";
import type { DbDateTimeFilter } from "../../../../shared/infrastructure/prisma/model/DbFilter";
import type { DbDecimalNumberFilter } from "../../../../shared/infrastructure/prisma/model/DbFilter";
import type { DbFieldOrderDirection } from "./DbFieldOrderDirection";
import type { DbIntegerNumberFilter } from "../../../../shared/infrastructure/prisma/model/DbFilter";
import type { DbNullableDateTimeFilter } from "../../../../shared/infrastructure/prisma/model/DbFilter";
import type { DbNullableIntegerNumberFilter } from "../../../../shared/infrastructure/prisma/model/DbFilter";
import type { DbTextFilter } from "../../../../shared/infrastructure/prisma/model/DbFilter";
import type { DbUuidFilter } from "../../../../shared/infrastructure/prisma/model/DbFilter";
import type { DecimalNumberFilter } from "../../../../shared/domain/model/Filter";
import type { IntegerNumberFilter } from "../../../../shared/domain/model/Filter";
import type { NullableDateTimeFilter } from "../../../../shared/domain/model/Filter";
import type { NullableIntegerNumberFilter } from "../../../../shared/domain/model/Filter";
import type { TextFilter } from "../../../../shared/domain/model/Filter";
import type { UuidFilter } from "../../../../shared/domain/model/Filter";
import { DateTimeFilterType } from "../../../../shared/domain/model/Filter";
import { DecimalNumberFilterType } from "../../../../shared/domain/model/Filter";
import { FieldOrderDirection } from "../../../../shared/domain/model/FieldOrder";
import { IntegerNumberFilterType } from "../../../../shared/domain/model/Filter";
import { NullableDateTimeFilterTypeNull } from "../../../../shared/domain/model/Filter";
import { NullableDateTimeFilterTypeValue } from "../../../../shared/domain/model/Filter";
import { NullableIntegerNumberFilterTypeNull } from "../../../../shared/domain/model/Filter";
import { NullableIntegerNumberFilterTypeValue } from "../../../../shared/domain/model/Filter";
import { TextFilterTypeList } from "../../../../shared/domain/model/Filter";
import { TextFilterTypeValue } from "../../../../shared/domain/model/Filter";
import { UuidFilterTypeList } from "../../../../shared/domain/model/Filter";
import { UuidFilterTypeValue } from "../../../../shared/domain/model/Filter";

export class DbModel {
    public static toDbBooleanFilter(filter: BooleanFilter): DbBooleanFilter {
        return { equals: filter.value };
    }

    public static toDbDateTimeFilter(filter: DateTimeFilter): DbDateTimeFilter {
        switch (filter.type) {
            case DateTimeFilterType.IsEqualTo: {
                return { equals: filter.value };
            }
            case DateTimeFilterType.IsGreaterThan: {
                return { gt: filter.value };
            }
            case DateTimeFilterType.IsGreaterThanOrEqualTo: {
                return { gte: filter.value };
            }
            case DateTimeFilterType.IsLessThan: {
                return { lt: filter.value };
            }
            case DateTimeFilterType.IsLessThanOrEqualTo: {
                return { lte: filter.value };
            }
            case DateTimeFilterType.IsNotEqualTo: {
                return { not: filter.value };
            }
        }
    }

    public static toDbDecimalNumberFilter(
        filter: DecimalNumberFilter,
    ): DbDecimalNumberFilter {
        switch (filter.type) {
            case DecimalNumberFilterType.IsEqualTo: {
                return { equals: filter.value };
            }
            case DecimalNumberFilterType.IsGreaterThan: {
                return { gt: filter.value };
            }
            case DecimalNumberFilterType.IsGreaterThanOrEqualTo: {
                return { gte: filter.value };
            }
            case DecimalNumberFilterType.IsLessThan: {
                return { lt: filter.value };
            }
            case DecimalNumberFilterType.IsLessThanOrEqualTo: {
                return { lte: filter.value };
            }
            case DecimalNumberFilterType.IsNotEqualTo: {
                return { not: filter.value };
            }
        }
    }

    public static toDbIntegerNumberFilter(
        filter: IntegerNumberFilter,
    ): DbIntegerNumberFilter {
        switch (filter.type) {
            case IntegerNumberFilterType.IsEqualTo: {
                return { equals: filter.value };
            }
            case IntegerNumberFilterType.IsGreaterThan: {
                return { gt: filter.value };
            }
            case IntegerNumberFilterType.IsGreaterThanOrEqualTo: {
                return { gte: filter.value };
            }
            case IntegerNumberFilterType.IsLessThan: {
                return { lt: filter.value };
            }
            case IntegerNumberFilterType.IsLessThanOrEqualTo: {
                return { lte: filter.value };
            }
            case IntegerNumberFilterType.IsNotEqualTo: {
                return { not: filter.value };
            }
        }
    }

    public static toDbNullableDateTimeFilter(
        filter: NullableDateTimeFilter,
    ): DbNullableDateTimeFilter {
        switch (filter.type) {
            case NullableDateTimeFilterTypeNull.IsNotNull: {
                return { not: null };
            }
            case NullableDateTimeFilterTypeNull.IsNull: {
                return { equals: null };
            }
            case NullableDateTimeFilterTypeValue.IsEqualTo: {
                return { equals: filter.value };
            }
            case NullableDateTimeFilterTypeValue.IsGreaterThan: {
                return { gt: filter.value };
            }
            case NullableDateTimeFilterTypeValue.IsGreaterThanOrEqualTo: {
                return { gte: filter.value };
            }
            case NullableDateTimeFilterTypeValue.IsLessThan: {
                return { lt: filter.value };
            }
            case NullableDateTimeFilterTypeValue.IsLessThanOrEqualTo: {
                return { lte: filter.value };
            }
            case NullableDateTimeFilterTypeValue.IsNotEqualTo: {
                return { not: filter.value };
            }
        }
    }

    public static toDbNullableIntegerNumberFilter(
        filter: NullableIntegerNumberFilter,
    ): DbNullableIntegerNumberFilter {
        switch (filter.type) {
            case NullableIntegerNumberFilterTypeNull.IsNotNull: {
                return { not: null };
            }
            case NullableIntegerNumberFilterTypeNull.IsNull: {
                return { equals: null };
            }
            case NullableIntegerNumberFilterTypeValue.IsEqualTo: {
                return { equals: filter.value };
            }
            case NullableIntegerNumberFilterTypeValue.IsGreaterThan: {
                return { gt: filter.value };
            }
            case NullableIntegerNumberFilterTypeValue.IsGreaterThanOrEqualTo: {
                return { gte: filter.value };
            }
            case NullableIntegerNumberFilterTypeValue.IsLessThan: {
                return { lt: filter.value };
            }
            case NullableIntegerNumberFilterTypeValue.IsLessThanOrEqualTo: {
                return { lte: filter.value };
            }
            case NullableIntegerNumberFilterTypeValue.IsNotEqualTo: {
                return { not: filter.value };
            }
        }
    }

    public static toDbOrderDirection(
        direction: FieldOrderDirection,
    ): DbFieldOrderDirection {
        switch (direction) {
            case FieldOrderDirection.Asc: {
                return "asc";
            }
            case FieldOrderDirection.Desc: {
                return "desc";
            }
        }
    }

    public static toDbTextFilter(filter: TextFilter): DbTextFilter {
        switch (filter.type) {
            case TextFilterTypeList.IsIn: {
                return {
                    in: filter.value,
                    mode: filter.caseSensitive ? "default" : "insensitive",
                };
            }
            case TextFilterTypeList.IsNotIn: {
                return {
                    mode: filter.caseSensitive ? "default" : "insensitive",
                    notIn: filter.value,
                };
            }
            case TextFilterTypeValue.Contains: {
                return {
                    contains: filter.value,
                    mode: filter.caseSensitive ? "default" : "insensitive",
                };
            }
            case TextFilterTypeValue.EndsWith: {
                return {
                    endsWith: filter.value,
                    mode: filter.caseSensitive ? "default" : "insensitive",
                };
            }
            case TextFilterTypeValue.IsEqualTo: {
                return {
                    equals: filter.value,
                    mode: filter.caseSensitive ? "default" : "insensitive",
                };
            }
            case TextFilterTypeValue.IsNotEqualTo: {
                return {
                    mode: filter.caseSensitive ? "default" : "insensitive",
                    not: filter.value,
                };
            }
            case TextFilterTypeValue.StartsWith: {
                return {
                    mode: filter.caseSensitive ? "default" : "insensitive",
                    startsWith: filter.value,
                };
            }
        }
    }

    public static toDbUuidFilter(filter: UuidFilter): DbUuidFilter {
        switch (filter.type) {
            case UuidFilterTypeList.IsIn: {
                return { in: filter.value.map((v) => v.longValue) };
            }
            case UuidFilterTypeList.IsNotIn: {
                return { notIn: filter.value.map((v) => v.longValue) };
            }
            case UuidFilterTypeValue.IsEqualTo: {
                return { equals: filter.value.longValue };
            }
            case UuidFilterTypeValue.IsNotEqualTo: {
                return { not: filter.value.longValue };
            }
        }
    }
}
