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
import { languageCodeToConceptId } from "$lib/view/domain/model/SupportedLanguage";

function collectConceptIds(data: any): ConceptId[] {
    const result: ConceptId[] = [];

    function recurse(obj: any) {
        if (obj instanceof ConceptId) {
            result.push(obj);
        } else if (typeof obj === "object" && obj !== null) {
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    recurse(obj[key]);
                }
            }
        }
    }

    recurse(data);
    return result;
}

export class FrontendViewUseCase {
    private static async getConceptAbstractionView({
        abstractionId,
        conceptId,
        operationService,
        parameters,
        preferredLanguageConceptId,
    }: {
        abstractionId: ConceptId;
        conceptId: ConceptId;
        operationService: OperationService;
        parameters: { [key: string]: string };
        preferredLanguageConceptId: ConceptId;
    }): Promise<DtoConceptAbstractionView> {
        const response = await operationService.runToRead(async (operation) => {
            const graphRepository = operation.graphRepository;

            const concept = await graphRepository.getConceptById(conceptId);
            const conceptRelations =
                await graphRepository.getConceptRelationsById(conceptId);

            const allConceptIds = collectConceptIds([
                conceptId,
                abstractionId,
                concept,
                conceptRelations,
            ]);
            const conceptNames =
                await graphRepository.getConceptNamesWithPreferredLanguage(
                    allConceptIds,
                    preferredLanguageConceptId,
                );

            const view = new ConceptAbstractionView({
                conceptId: conceptId,
                abstractionId: abstractionId,
                parameters: parameters,
                data: {
                    concept: concept,
                    conceptRelations: conceptRelations,
                },
                names: conceptNames,
            });
            return DtoConceptAbstractionViewTransformer.fromDomain(view);
        });
        return response;
    }

    private static async getDatakoroLoginConceptView({
        conceptId,
        operationService,
        parameters,
        preferredLanguageConceptId,
    }: {
        conceptId: ConceptId;
        operationService: OperationService;
        parameters: { [key: string]: string };
        preferredLanguageConceptId: ConceptId;
    }): Promise<DtoDatakoroLoginConceptView> {
        const response = await operationService.runToRead(async (operation) => {
            const graphRepository = operation.graphRepository;

            const allConceptIds = collectConceptIds([conceptId]);
            const conceptNames =
                await graphRepository.getConceptNamesWithPreferredLanguage(
                    allConceptIds,
                    preferredLanguageConceptId,
                );

            const view = new DatakoroLoginConceptView({
                conceptId: conceptId,
                parameters: parameters,
                names: conceptNames,
            });
            return DtoDatakoroLoginConceptViewTransformer.fromDomain(view);
        });
        return response;
    }

    private static async getDatakoroSearchConceptView({
        conceptId,
        operationService,
        parameters,
        preferredLanguageConceptId,
    }: {
        conceptId: ConceptId;
        operationService: OperationService;
        parameters: { [key: string]: string };
        preferredLanguageConceptId: ConceptId;
    }): Promise<DtoDatakoroSearchConceptView> {
        const response = await operationService.runToRead(async (operation) => {
            const graphRepository = operation.graphRepository;

            const conceptIds = await graphRepository.getConceptIdsBySearch(
                parameters["q"],
                preferredLanguageConceptId,
            );

            const allConceptIds = collectConceptIds([conceptId, conceptIds]);
            const conceptNames =
                await graphRepository.getConceptNamesWithPreferredLanguage(
                    allConceptIds,
                    preferredLanguageConceptId,
                );

            const view = new DatakoroSearchConceptView({
                conceptId: conceptId,
                data: {
                    // TODO
                    numberOfResultsPerPage: conceptIds.length,
                    numberOfTotalResults: conceptIds.length,
                    pageNumber: 1,
                    results: conceptIds,
                },
                parameters: parameters,
                names: conceptNames,
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
        const preferredLanguageConceptId = languageCodeToConceptId(
            dto.preferredLanguageCode,
        );

        if (abstractionId?.shortValue === ID_CONCEPT.shortValue) {
            return await FrontendViewUseCase.getConceptAbstractionView({
                abstractionId: abstractionId,
                conceptId: conceptId,
                operationService: operationService,
                parameters: dto.parameters,
                preferredLanguageConceptId: preferredLanguageConceptId,
            });
        }
        if (
            null == abstractionId &&
            ID_DATAKORO_LOGIN.shortValue === conceptId.shortValue
        ) {
            return await FrontendViewUseCase.getDatakoroLoginConceptView({
                conceptId: conceptId,
                operationService: operationService,
                parameters: dto.parameters,
                preferredLanguageConceptId: preferredLanguageConceptId,
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
                preferredLanguageConceptId: preferredLanguageConceptId,
            });
        }

        // TODO
        throw "Not implemented.";
    }
}
