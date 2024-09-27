import * as uuid from "uuid";
import shortUUID from "short-uuid";
import type { Decimal } from "decimal.js/decimal";

import { InvalidPositiveIntegerException } from "./DomainException";
import { InvalidPositiveNonZeroIntegerException } from "./DomainException";
import { InvalidUuidException } from "./DomainException";
import { MekadimoDate } from "./MekadimoDate";

const SHORT_UUID_LENGTH = 22;
const SHORT_UUID_TRANSLATOR = shortUUID(shortUUID.constants.flickrBase58);

export abstract class ValueObject {}

export abstract class ValueObjectSingleValue<T> extends ValueObject {
    public readonly value: T;

    constructor(value: T) {
        super();
        this.value = Object.freeze(value);
    }
}

export abstract class BooleanValueObject extends ValueObjectSingleValue<boolean> {}

export abstract class DateTimeValueObject extends ValueObjectSingleValue<Date> {
    public readonly mekadimoDate: MekadimoDate;

    constructor(value: Date) {
        super(value);
        this.mekadimoDate = Object.freeze(new MekadimoDate(value));
    }
}

export abstract class NumberValueObject<
    T extends Decimal | bigint,
> extends ValueObjectSingleValue<T> {}

export abstract class DecimalNumberValueObject extends NumberValueObject<Decimal> {}

export abstract class IntegerNumberValueObject extends NumberValueObject<bigint> {}

export abstract class PositiveIntegerNumberValueObject extends IntegerNumberValueObject {
    constructor(value: bigint) {
        super(value);
        this.assertIsValid();
    }

    private assertIsValid(): void {
        if (0 >= this.value) {
            throw new InvalidPositiveIntegerException({
                value: this.value.toString(),
            });
        }
    }
}

export abstract class PositiveNonZeroIntegerNumberValueObject extends IntegerNumberValueObject {
    constructor(value: bigint) {
        super(value);
        this.assertIsValid();
    }

    private assertIsValid(): void {
        if (0 > this.value) {
            throw new InvalidPositiveNonZeroIntegerException({
                value: this.value.toString(),
            });
        }
    }
}

export abstract class TextValueObject extends ValueObjectSingleValue<string> {}

export abstract class UuidValueObject extends ValueObject {
    public readonly longValue: string;
    public readonly shortValue: string;

    constructor(rawInputValue: string) {
        super();

        const inputValue =
            32 === rawInputValue.length
                ? UuidValueObject.normalizeFullValue(rawInputValue)
                : rawInputValue;

        const inputValueIsShort = SHORT_UUID_LENGTH === inputValue.length;
        if (inputValueIsShort) {
            UuidValueObject.assertShortUuidIsValid(inputValue);
        } else {
            UuidValueObject.assertLongUuidIsValid(inputValue);
        }

        const shortValue = inputValueIsShort
            ? inputValue
            : SHORT_UUID_TRANSLATOR.fromUUID(inputValue);
        const longValue = SHORT_UUID_TRANSLATOR.toUUID(shortValue);
        const normalizedLongValue =
            UuidValueObject.normalizeFullValue(longValue);

        this.shortValue = Object.freeze(shortValue);
        this.longValue = Object.freeze(normalizedLongValue);
    }

    private static assertLongUuidIsValid(inputValue: string): void {
        if (!uuid.validate(inputValue)) {
            throw new InvalidUuidException({ value: inputValue });
        }
    }

    private static assertShortUuidIsValid(inputValue: string): void {
        if (!SHORT_UUID_TRANSLATOR.validate(inputValue)) {
            throw new InvalidUuidException({ value: inputValue });
        }
    }

    protected static generateRandomValue(): string {
        const randomValue = SHORT_UUID_TRANSLATOR.generate();
        return randomValue;
    }

    private static normalizeFullValue(fullValue: string): string {
        const cleaned =
            32 === fullValue.length
                ? fullValue.toLowerCase()
                : fullValue.replace(/[{}-]/g, "").toLowerCase();

        const normalizedFullString =
            cleaned.slice(0, 8) +
            "-" +
            cleaned.slice(8, 12) +
            "-" +
            cleaned.slice(12, 16) +
            "-" +
            cleaned.slice(16, 20) +
            "-" +
            cleaned.slice(20);
        return normalizedFullString;
    }
}
