import type { GraphRepository } from "../../../../graph/domain/repository/GraphRepository";
import { DbGraphRepository } from "../../../../graph/infrastructure/prisma/repository/DbGraphRepository";
import { Operation } from "../../../domain/model/Operation";

export class DbOperation extends Operation {
    private _graphRepository?: GraphRepository;

    public get graphRepository(): GraphRepository {
        if (undefined == this._graphRepository) {
            this._graphRepository = new DbGraphRepository(this.transaction);
        }
        return this._graphRepository;
    }
}
