import type { Decimal } from "decimal.js/decimal";

import type { UuidValueObject } from "./ValueObject";

export type BooleanFilter = { value: boolean };

export type DateTimeFilter = { type: DateTimeFilterType; value: Date };

export enum DateTimeFilterType {
    IsEqualTo = "DateTimeFilterType.IsEqualTo",
    IsGreaterThan = "DateTimeFilterType.IsGreaterThan",
    IsGreaterThanOrEqualTo = "DateTimeFilterType.IsGreaterThanOrEqualTo",
    IsLessThan = "DateTimeFilterType.IsLessThan",
    IsLessThanOrEqualTo = "DateTimeFilterType.IsLessThanOrEqualTo",
    IsNotEqualTo = "DateTimeFilterType.IsNotEqualTo",
}

export type DecimalNumberFilter = {
    type: DecimalNumberFilterType;
    value: Decimal;
};

export enum DecimalNumberFilterType {
    IsEqualTo = "DecimalNumberFilterType.IsEqualTo",
    IsGreaterThan = "DecimalNumberFilterType.IsGreaterThan",
    IsGreaterThanOrEqualTo = "DecimalNumberFilterType.IsGreaterThanOrEqualTo",
    IsLessThan = "DecimalNumberFilterType.IsLessThan",
    IsLessThanOrEqualTo = "DecimalNumberFilterType.IsLessThanOrEqualTo",
    IsNotEqualTo = "DecimalNumberFilterType.IsNotEqualTo",
}

export type DecimalNumberIntervalFilter =
    | { type: DecimalNumberIntervalFilterTypeValue; value: Decimal }
    | {
          type: DecimalNumberIntervalFilterTypeInterval;
          value: [Decimal | null, Decimal | null];
      };

export enum DecimalNumberIntervalFilterTypeInterval {
    IsEqualTo = "DecimalNumberIntervalFilterTypeInterval.IsEqualTo",
    IsNotEqualTo = "DecimalNumberIntervalFilterTypeInterval.IsNotEqualTo",
}

export enum DecimalNumberIntervalFilterTypeValue {
    ContainsValue = "DecimalNumberIntervalFilterTypeValue.ContainsValue",
}

export type IntegerNumberFilter = {
    type: IntegerNumberFilterType;
    value: bigint;
};

export enum IntegerNumberFilterType {
    IsEqualTo = "IntegerNumberFilterType.IsEqualTo",
    IsGreaterThan = "IntegerNumberFilterType.IsGreaterThan",
    IsGreaterThanOrEqualTo = "IntegerNumberFilterType.IsGreaterThanOrEqualTo",
    IsLessThan = "IntegerNumberFilterType.IsLessThan",
    IsLessThanOrEqualTo = "IntegerNumberFilterType.IsLessThanOrEqualTo",
    IsNotEqualTo = "IntegerNumberFilterType.IsNotEqualTo",
}

export type IntegerNumberIntervalFilter =
    | { type: IntegerNumberIntervalFilterTypeValue; value: bigint }
    | {
          type: IntegerNumberIntervalFilterTypeInterval;
          value: [bigint, bigint];
      };

export enum IntegerNumberIntervalFilterTypeInterval {
    IsEqualTo = "IntegerNumberIntervalFilterTypeInterval.IsEqualTo",
    IsNotEqualTo = "IntegerNumberIntervalFilterTypeInterval.IsNotEqualTo",
}

export enum IntegerNumberIntervalFilterTypeValue {
    ContainsValue = "IntegerNumberIntervalFilterTypeValue.ContainsValue",
}

export type NullableDateTimeFilter =
    | { type: NullableDateTimeFilterTypeValue; value: Date }
    | { type: NullableDateTimeFilterTypeNull };

export enum NullableDateTimeFilterTypeNull {
    IsNotNull = "NullableDateTimeFilterTypeNull.IsNotNull",
    IsNull = "NullableDateTimeFilterTypeNull.IsNull",
}

export enum NullableDateTimeFilterTypeValue {
    IsEqualTo = "NullableDateTimeFilterTypeValue.IsEqualTo",
    IsGreaterThan = "NullableDateTimeFilterTypeValue.IsGreaterThan",
    IsGreaterThanOrEqualTo = "NullableDateTimeFilterTypeValue.IsGreaterThanOrEqualTo",
    IsLessThan = "NullableDateTimeFilterTypeValue.IsLessThan",
    IsLessThanOrEqualTo = "NullableDateTimeFilterTypeValue.IsLessThanOrEqualTo",
    IsNotEqualTo = "NullableDateTimeFilterTypeValue.IsNotEqualTo",
}

export type NullableIntegerNumberFilter =
    | {
          type: NullableIntegerNumberFilterTypeValue;
          value: bigint;
      }
    | {
          type: NullableIntegerNumberFilterTypeNull;
      };

export enum NullableIntegerNumberFilterTypeNull {
    IsNotNull = "NullableIntegerNumberFilterTypeNull.IsNotNull",
    IsNull = "NullableIntegerNumberFilterTypeNull.IsNull",
}

export enum NullableIntegerNumberFilterTypeValue {
    IsEqualTo = "NullableIntegerNumberFilterType.IsEqualTo",
    IsGreaterThan = "NullableIntegerNumberFilterType.IsGreaterThan",
    IsGreaterThanOrEqualTo = "NullableIntegerNumberFilterType.IsGreaterThanOrEqualTo",
    IsLessThan = "NullableIntegerNumberFilterType.IsLessThan",
    IsLessThanOrEqualTo = "NullableIntegerNumberFilterType.IsLessThanOrEqualTo",
    IsNotEqualTo = "NullableIntegerNumberFilterType.IsNotEqualTo",
}

export type TextFilter =
    | {
          type: TextFilterTypeValue;
          caseSensitive: boolean;
          value: string;
      }
    | {
          type: TextFilterTypeList;
          caseSensitive: boolean;
          value: string[];
      };

export enum TextFilterTypeList {
    IsIn = "TextFilterTypeList.IsIn",
    IsNotIn = "TextFilterTypeList.IsNotIn",
}

export enum TextFilterTypeValue {
    Contains = "TextFilterType.Contains",
    EndsWith = "TextFilterType.EndsWith",
    IsEqualTo = "TextFilterType.IsEqualTo",
    IsNotEqualTo = "TextFilterType.IsNotEqualTo",
    // TODO: Not supported by Prisma
    // NotContains = "TextFilterType.NotContains",
    // NotEndsWith = "TextFilterType.NotEndsWith",
    // NotStartsWith = "TextFilterType.NotStartsWith",
    StartsWith = "TextFilterType.StartsWith",
}

export type UuidFilter =
    | { type: UuidFilterTypeValue; value: UuidValueObject }
    | { type: UuidFilterTypeList; value: UuidValueObject[] };

export enum UuidFilterTypeList {
    IsIn = "UuidFilterTypeList.IsIn",
    IsNotIn = "UuidFilterTypeList.IsNotIn",
}

export enum UuidFilterTypeValue {
    IsEqualTo = "UuidFilterTypeValue.IsEqualTo",
    IsNotEqualTo = "UuidFilterTypeValue.IsNotEqualTo",
}
