import type { Operation } from "../model/Operation";
import { UserConceptId } from "../../../user/domain/model/UserConcept";

export abstract class OperationService {
    public readonly userId: UserConceptId | null;

    constructor(userId: UserConceptId | null) {
        this.userId = userId;
    }

    protected abstract run<T>(input: {
        isReadOnly: boolean;
        runFunction: (operation: Operation) => Promise<T>;
    }): Promise<T>;

    public async runToRead<T>(
        runFunction: (operation: Operation) => Promise<T>,
    ): Promise<T> {
        return this.run({ isReadOnly: true, runFunction: runFunction });
    }

    public async runToReadAndWrite<T>(
        runFunction: (operation: Operation) => Promise<T>,
    ): Promise<T> {
        return this.run({ isReadOnly: false, runFunction: runFunction });
    }
}
