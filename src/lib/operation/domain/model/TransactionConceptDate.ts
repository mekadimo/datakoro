import { DateTimeValueObject } from "../../../shared/domain/model/ValueObject";

export class TransactionConceptDate extends DateTimeValueObject {
    public static createCurrent(): TransactionConceptDate {
        const currentDate = new Date();
        return new TransactionConceptDate(currentDate);
    }
}
