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

function collectConceptIds(data: unknown): ConceptId[] {
    const conceptIdShortValues = new Set<string>();

    function recurse(obj: unknown) {
        if (obj instanceof ConceptId) {
            conceptIdShortValues.add(obj.shortValue);
        } else if (collectConceptIdsIsRecordHelper(obj)) {
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    recurse(obj[key]);
                }
            }
        }
    }
    recurse(data);

    return Array.from(conceptIdShortValues).map((v) => new ConceptId(v));
}

// Required for TypeScript type checking
function collectConceptIdsIsRecordHelper(
    obj: unknown,
): obj is Record<string, unknown> {
    return typeof obj === "object" && null != obj;
}

export class FrontendViewUseCase {
    private static async getConceptAbstractionView(input: {
        abstractionId: ConceptId;
        conceptId: ConceptId;
        operationService: OperationService;
        parameters: { [key: string]: string };
        preferredLanguageConceptId: ConceptId;
    }): Promise<DtoConceptAbstractionView> {
        const response = await input.operationService.runToRead(
            async (operation) => {
                const graphRepository = operation.graphRepository;

                const concept = await graphRepository.getConceptById(
                    input.conceptId,
                );
                const conceptRelations =
                    await graphRepository.getConceptRelationsById(
                        input.conceptId,
                    );

                const allConceptIds = collectConceptIds([
                    input.conceptId,
                    input.abstractionId,
                    concept,
                    conceptRelations,
                ]);
                const conceptNames =
                    await graphRepository.getConceptNamesWithPreferredLanguage(
                        allConceptIds,
                        input.preferredLanguageConceptId,
                    );

                const view = new ConceptAbstractionView({
                    conceptId: input.conceptId,
                    abstractionId: input.abstractionId,
                    parameters: input.parameters,
                    data: {
                        concept: concept,
                        conceptRelations: conceptRelations,
                    },
                    names: conceptNames,
                });
                return DtoConceptAbstractionViewTransformer.fromDomain(view);
            },
        );
        return response;
    }

    private static async getDatakoroLoginConceptView(input: {
        conceptId: ConceptId;
        operationService: OperationService;
        parameters: { [key: string]: string };
        preferredLanguageConceptId: ConceptId;
    }): Promise<DtoDatakoroLoginConceptView> {
        const response = await input.operationService.runToRead(
            async (operation) => {
                const graphRepository = operation.graphRepository;

                const allConceptIds = collectConceptIds([input.conceptId]);
                const conceptNames =
                    await graphRepository.getConceptNamesWithPreferredLanguage(
                        allConceptIds,
                        input.preferredLanguageConceptId,
                    );

                const view = new DatakoroLoginConceptView({
                    conceptId: input.conceptId,
                    parameters: input.parameters,
                    names: conceptNames,
                });
                return DtoDatakoroLoginConceptViewTransformer.fromDomain(view);
            },
        );
        return response;
    }

    private static async getDatakoroSearchConceptView(input: {
        conceptId: ConceptId;
        operationService: OperationService;
        parameters: { [key: string]: string };
        preferredLanguageConceptId: ConceptId;
    }): Promise<DtoDatakoroSearchConceptView> {
        const response = await input.operationService.runToRead(
            async (operation) => {
                const graphRepository = operation.graphRepository;

                const conceptIds = await graphRepository.getConceptIdsBySearch(
                    input.parameters["q"],
                    input.preferredLanguageConceptId,
                );

                const allConceptIds = collectConceptIds([
                    input.conceptId,
                    conceptIds,
                ]);
                const conceptNames =
                    await graphRepository.getConceptNamesWithPreferredLanguage(
                        allConceptIds,
                        input.preferredLanguageConceptId,
                    );

                const view = new DatakoroSearchConceptView({
                    conceptId: input.conceptId,
                    data: {
                        // TODO
                        numberOfResultsPerPage: conceptIds.length,
                        numberOfTotalResults: conceptIds.length,
                        pageNumber: 1,
                        results: conceptIds,
                    },
                    parameters: input.parameters,
                    names: conceptNames,
                });
                return DtoDatakoroSearchConceptViewTransformer.fromDomain(view);
            },
        );
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
