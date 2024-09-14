import { error } from "@sveltejs/kit";

import type { DtoConceptAbstractionView } from "$lib/view/application/dto/DtoConceptAbstractionView";
import type { DtoDatakoroLoginConceptView } from "$lib/view/application/dto/DtoDatakoroLoginConceptView";
import type { DtoDatakoroSearchConceptView } from "$lib/view/application/dto/DtoDatakoroSearchConceptView";
import type { DtoGetViewInput } from "$lib/view/application/dto/DtoFrontendView.js";
import { DbOperationService } from "$lib/operation/infrastructure/prisma/service/DbOperationService";
import { FrontendViewUseCase } from "$lib/view/application/use_case/FrontendViewUseCase.js";

export async function load({
    params,
    url,
}): Promise<
    | DtoConceptAbstractionView
    | DtoDatakoroLoginConceptView
    | DtoDatakoroSearchConceptView
> {
    const cGetParam = url.searchParams.get("c");
    if (null == cGetParam) {
        throw error(404, "Concept not found.");
    }

    const aGetParam = url.searchParams.get("a");

    const getParams = url.searchParams.entries();
    const extraGetParams: { [key: string]: string } = {};
    for (const getParam of getParams) {
        if ("c" == getParam[0] || "a" == getParam[0]) {
            continue;
        }
        extraGetParams[getParam[0]] = getParam[1];
    }

    const dtoInput: DtoGetViewInput = {
        conceptId: cGetParam,
        abstractionId: aGetParam,
        parameters: extraGetParams,
        preferredLanguageCode: params.languageCode,
    };
    const operationService = new DbOperationService(null);
    const dtoOutput = await FrontendViewUseCase.getView(
        operationService,
        dtoInput,
    );
    return dtoOutput;
}
