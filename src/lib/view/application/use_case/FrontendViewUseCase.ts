import type { DtoConceptAbstractionView } from "../dto/DtoConceptAbstractionView";
import type { DtoDatakoroLoginConceptView } from "../dto/DtoDatakoroLoginConceptView";
import type { DtoDatakoroSearchConceptView } from "../dto/DtoDatakoroSearchConceptView";
import type { DtoGetViewInput } from "../dto/DtoFrontendView";
import type { OperationService } from "$lib/operation/domain/service/OperationService";
import { ConceptAbstractionView } from "$lib/view/domain/model/ConceptAbstractionView";
import { ConceptId } from "../../../graph/domain/model/ConceptId";
import { DatakoroLoginConceptView } from "$lib/view/domain/model/DatakoroLoginConceptView";
import { DatakoroSearchConceptView } from "$lib/view/domain/model/DatakoroSearchConceptView";
import { DtoConceptAbstractionViewTransformer } from "../dto/DtoConceptAbstractionView";
import { DtoDatakoroLoginConceptViewTransformer } from "../dto/DtoDatakoroLoginConceptView";
import { DtoDatakoroSearchConceptViewTransformer } from "../dto/DtoDatakoroSearchConceptView";
import { ID_CONCEPT } from "../../../graph/domain/model/ConceptId";
import { ID_DATAKORO_LOGIN } from "../../../graph/domain/model/ConceptId";
import { ID_DATAKORO_SEARCH } from "../../../graph/domain/model/ConceptId";

export class FrontendViewUseCase {
    private static async getConceptAbstractionView({
        abstractionId,
        conceptId,
        operationService,
        parameters,
    }: {
        abstractionId: ConceptId;
        conceptId: ConceptId;
        operationService: OperationService;
        parameters: { [key: string]: string };
    }): Promise<DtoConceptAbstractionView> {
        const response = await operationService.runToRead(async (operation) => {
            const graphRepository = operation.graphRepository;

            const concept = await graphRepository.getConceptById(conceptId);
            const conceptRelations =
                await graphRepository.getConceptRelationsById(conceptId);

            const view = new ConceptAbstractionView({
                conceptId: conceptId,
                abstractionId: abstractionId,
                parameters: parameters,
                data: {
                    concept: concept,
                    conceptRelations: conceptRelations,
                },
            });
            return DtoConceptAbstractionViewTransformer.fromDomain(view);
        });
        return response;
    }

    private static async getDatakoroLoginConceptView({
        conceptId,
        parameters,
    }: {
        conceptId: ConceptId;
        parameters: { [key: string]: string };
    }): Promise<DtoDatakoroLoginConceptView> {
        const view = new DatakoroLoginConceptView({
            conceptId: conceptId,
            parameters: parameters,
        });
        return DtoDatakoroLoginConceptViewTransformer.fromDomain(view);
    }

    private static async getDatakoroSearchConceptView({
        conceptId,
        operationService,
        parameters,
    }: {
        conceptId: ConceptId;
        operationService: OperationService;
        parameters: { [key: string]: string };
    }): Promise<DtoDatakoroSearchConceptView> {
        const response = await operationService.runToRead(async (operation) => {
            const graphRepository = operation.graphRepository;

            const view = new DatakoroSearchConceptView({
                conceptId: conceptId,
                data: {
                    numberOfResultsPerPage: 0, // TODO
                    numberOfTotalResults: 0, // TODO
                    pageNumber: 0, // TODO
                    results: [], // TODO
                },
                parameters: parameters,
            });
            return DtoDatakoroSearchConceptViewTransformer.fromDomain(view);
        });
        return response;
    }

    public static async getView(
        operationService: OperationService,
        dto: DtoGetViewInput,
    ): Promise<DtoConceptAbstractionView | DtoDatakoroLoginConceptView> {
        const conceptId = new ConceptId(dto.conceptId);
        const abstractionId =
            null == dto.abstractionId ? null : new ConceptId(dto.abstractionId);

        if (abstractionId?.shortValue === ID_CONCEPT.shortValue) {
            return await FrontendViewUseCase.getConceptAbstractionView({
                abstractionId: abstractionId,
                conceptId: conceptId,
                operationService: operationService,
                parameters: dto.parameters,
            });
        }
        if (
            null == abstractionId &&
            ID_DATAKORO_LOGIN.shortValue === conceptId.shortValue
        ) {
            return await FrontendViewUseCase.getDatakoroLoginConceptView({
                conceptId: conceptId,
                parameters: dto.parameters,
            });
        }
        if (
            null == abstractionId &&
            ID_DATAKORO_SEARCH.shortValue === conceptId.shortValue
        ) {
            return await FrontendViewUseCase.getDatakoroSearchConceptView({
                conceptId: conceptId,
                operationService: operationService,
                parameters: dto.parameters,
            });
        }

        // TODO
        throw "Not implemented.";
    }
}
