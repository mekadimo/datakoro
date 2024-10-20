import type { DbDateTimeFilter } from "../../../../shared/infrastructure/prisma/model/DbFilter";
import type { DbFieldOrderDirection } from "../../../../shared/infrastructure/prisma/model/DbFieldOrderDirection";
import type { DbTextFilter } from "../../../../shared/infrastructure/prisma/model/DbFilter";
import type { DbUuidFilter } from "../../../../shared/infrastructure/prisma/model/DbFilter";
import type { PrivateUserSessionFieldOrder } from "../../../domain/model/UserSession";
import type { PrivateUserSessionFilter } from "../../../domain/model/UserSession";
import type { ServerUserSessionFieldOrder } from "../../../domain/model/ServerUserSession";
import type { ServerUserSessionFilter } from "../../../domain/model/ServerUserSession";
import { DbModel } from "../../../../shared/infrastructure/prisma/model/DbModel";
import { PrivateUserSessionField } from "../../../domain/model/UserSession";
import { ServerUserSession } from "../../../domain/model/ServerUserSession";
import { ServerUserSessionField } from "../../../domain/model/ServerUserSession";
import { ServerUserSessionSecretKey } from "../../../domain/model/ServerUserSession";
import { UserSessionCsrfToken } from "../../../domain/model/UserSession";
import { UserSessionId } from "../../../domain/model/UserSession";
import { UserSessionIp } from "../../../domain/model/UserSession";
import { UserSessionLastRequestDate } from "../../../domain/model/UserSession";
import { UserSessionStartDate } from "../../../domain/model/UserSession";
import { UserSessionUserAgentRequestHeader } from "../../../domain/model/UserSession";
import { UserSessionUserId } from "../../../domain/model/UserSession";

type DbPrivateUserSessionFilter =
    | { id: DbUuidFilter }
    | { ip: DbTextFilter }
    | { last_request_date: DbDateTimeFilter }
    | { start_date: DbDateTimeFilter }
    | { user_agent_request_header: DbTextFilter }
    | { user_id: DbUuidFilter };

type DbPrivateUserSessionFieldOrder =
    | { id: DbFieldOrderDirection }
    | { ip: DbFieldOrderDirection }
    | { last_request_date: DbFieldOrderDirection }
    | { start_date: DbFieldOrderDirection }
    | { user_agent_request_header: DbFieldOrderDirection }
    | { user_id: DbFieldOrderDirection };

type DbServerUserSessionFilter =
    | { csrf_token: DbUuidFilter }
    | { id: DbUuidFilter }
    | { ip: DbTextFilter }
    | { last_request_date: DbDateTimeFilter }
    | { secret_key: DbUuidFilter }
    | { start_date: DbDateTimeFilter }
    | { user_agent_request_header: DbTextFilter }
    | { user_id: DbUuidFilter };

type DbServerUserSessionFieldOrder =
    | { csrf_token: DbFieldOrderDirection }
    | { id: DbFieldOrderDirection }
    | { ip: DbFieldOrderDirection }
    | { last_request_date: DbFieldOrderDirection }
    | { secret_key: DbFieldOrderDirection }
    | { start_date: DbFieldOrderDirection }
    | { user_agent_request_header: DbFieldOrderDirection }
    | { user_id: DbFieldOrderDirection };

export class DbUserSession {
    csrf_token: string;
    id: string;
    ip: string;
    last_request_date: Date;
    secret_key: string;
    start_date: Date;
    user_agent_request_header: string;
    user_id: string;

    constructor(input: {
        csrf_token: string;
        id: string;
        ip: string;
        last_request_date: Date;
        secret_key: string;
        start_date: Date;
        user_agent_request_header: string;
        user_id: string;
    }) {
        this.csrf_token = input.csrf_token;
        this.id = input.id;
        this.ip = input.ip;
        this.last_request_date = input.last_request_date;
        this.secret_key = input.secret_key;
        this.start_date = input.start_date;
        this.user_agent_request_header = input.user_agent_request_header;
        this.user_id = input.user_id;
    }

    public static fromServerDomain(
        serverUserSession: ServerUserSession,
    ): DbUserSession {
        return new DbUserSession({
            csrf_token: serverUserSession.csrfToken.longValue,
            id: serverUserSession.id.longValue,
            ip: serverUserSession.ip.value,
            last_request_date: serverUserSession.lastRequestDate.value,
            secret_key: serverUserSession.secretKey.longValue,
            start_date: serverUserSession.startDate.value,
            user_agent_request_header:
                serverUserSession.userAgentRequestHeader.value,
            user_id: serverUserSession.userId.longValue,
        });
    }

    public static toDbPrivateFilter(
        filter: PrivateUserSessionFilter,
    ): DbPrivateUserSessionFilter {
        switch (filter.field) {
            case PrivateUserSessionField.Id: {
                return {
                    id: DbModel.toDbUuidFilter(filter.filter),
                };
            }
            case PrivateUserSessionField.Ip: {
                return {
                    ip: DbModel.toDbTextFilter(filter.filter),
                };
            }
            case PrivateUserSessionField.LastRequestDate: {
                return {
                    last_request_date: DbModel.toDbDateTimeFilter(
                        filter.filter,
                    ),
                };
            }
            case PrivateUserSessionField.StartDate: {
                return {
                    start_date: DbModel.toDbDateTimeFilter(filter.filter),
                };
            }
            case PrivateUserSessionField.UserAgentRequestHeader: {
                return {
                    user_agent_request_header: DbModel.toDbTextFilter(
                        filter.filter,
                    ),
                };
            }
            case PrivateUserSessionField.UserId: {
                return {
                    user_id: DbModel.toDbUuidFilter(filter.filter),
                };
            }
        }
    }

    public static toDbPrivateFilterWhere(filters: PrivateUserSessionFilter[]): {
        AND: DbPrivateUserSessionFilter[];
    } {
        const dbFilters = filters.map((f) =>
            DbUserSession.toDbPrivateFilter(f),
        );
        return { AND: dbFilters };
    }

    public static toDbPrivateOrder(
        order: PrivateUserSessionFieldOrder,
    ): DbPrivateUserSessionFieldOrder {
        switch (order.field) {
            case PrivateUserSessionField.Id: {
                return {
                    id: DbModel.toDbOrderDirection(order.direction),
                };
            }
            case PrivateUserSessionField.Ip: {
                return {
                    ip: DbModel.toDbOrderDirection(order.direction),
                };
            }
            case PrivateUserSessionField.LastRequestDate: {
                return {
                    last_request_date: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case PrivateUserSessionField.StartDate: {
                return {
                    start_date: DbModel.toDbOrderDirection(order.direction),
                };
            }
            case PrivateUserSessionField.UserAgentRequestHeader: {
                return {
                    user_agent_request_header: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case PrivateUserSessionField.UserId: {
                return {
                    user_id: DbModel.toDbOrderDirection(order.direction),
                };
            }
        }
    }

    public static toDbPrivateOrderBy(
        orderBy: PrivateUserSessionFieldOrder[],
    ): DbPrivateUserSessionFieldOrder[] {
        const dbOrderBy = orderBy.map((o) => DbUserSession.toDbPrivateOrder(o));
        return dbOrderBy;
    }

    public static toDbServerFilter(
        filter: ServerUserSessionFilter,
    ): DbServerUserSessionFilter {
        switch (filter.field) {
            case ServerUserSessionField.CsrfToken: {
                return {
                    csrf_token: DbModel.toDbUuidFilter(filter.filter),
                };
            }
            case ServerUserSessionField.Id: {
                return {
                    id: DbModel.toDbUuidFilter(filter.filter),
                };
            }
            case ServerUserSessionField.Ip: {
                return {
                    ip: DbModel.toDbTextFilter(filter.filter),
                };
            }
            case ServerUserSessionField.LastRequestDate: {
                return {
                    last_request_date: DbModel.toDbDateTimeFilter(
                        filter.filter,
                    ),
                };
            }
            case ServerUserSessionField.SecretKey: {
                return {
                    secret_key: DbModel.toDbUuidFilter(filter.filter),
                };
            }
            case ServerUserSessionField.StartDate: {
                return {
                    start_date: DbModel.toDbDateTimeFilter(filter.filter),
                };
            }
            case ServerUserSessionField.UserAgentRequestHeader: {
                return {
                    user_agent_request_header: DbModel.toDbTextFilter(
                        filter.filter,
                    ),
                };
            }
            case ServerUserSessionField.UserId: {
                return {
                    user_id: DbModel.toDbUuidFilter(filter.filter),
                };
            }
        }
    }

    public static toDbServerFilterWhere(filters: ServerUserSessionFilter[]): {
        AND: DbServerUserSessionFilter[];
    } {
        const dbFilters = filters.map((f) => DbUserSession.toDbServerFilter(f));
        return { AND: dbFilters };
    }

    public static toDbServerOrder(
        order: ServerUserSessionFieldOrder,
    ): DbServerUserSessionFieldOrder {
        switch (order.field) {
            case ServerUserSessionField.CsrfToken: {
                return {
                    csrf_token: DbModel.toDbOrderDirection(order.direction),
                };
            }
            case ServerUserSessionField.Id: {
                return {
                    id: DbModel.toDbOrderDirection(order.direction),
                };
            }
            case ServerUserSessionField.Ip: {
                return {
                    ip: DbModel.toDbOrderDirection(order.direction),
                };
            }
            case ServerUserSessionField.LastRequestDate: {
                return {
                    last_request_date: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case ServerUserSessionField.SecretKey: {
                return {
                    secret_key: DbModel.toDbOrderDirection(order.direction),
                };
            }
            case ServerUserSessionField.StartDate: {
                return {
                    start_date: DbModel.toDbOrderDirection(order.direction),
                };
            }
            case ServerUserSessionField.UserAgentRequestHeader: {
                return {
                    user_agent_request_header: DbModel.toDbOrderDirection(
                        order.direction,
                    ),
                };
            }
            case ServerUserSessionField.UserId: {
                return {
                    user_id: DbModel.toDbOrderDirection(order.direction),
                };
            }
        }
    }

    public static toDbServerOrderBy(
        orderBy: ServerUserSessionFieldOrder[],
    ): DbServerUserSessionFieldOrder[] {
        const dbOrderBy = orderBy.map((o) => DbUserSession.toDbServerOrder(o));
        return dbOrderBy;
    }

    public toServerDomain(): ServerUserSession {
        return new ServerUserSession({
            csrfToken: new UserSessionCsrfToken(this.csrf_token),
            id: new UserSessionId(this.id),
            ip: new UserSessionIp(this.ip),
            lastRequestDate: new UserSessionLastRequestDate(
                this.last_request_date,
            ),
            secretKey: new ServerUserSessionSecretKey(this.secret_key),
            startDate: new UserSessionStartDate(this.start_date),
            userAgentRequestHeader: new UserSessionUserAgentRequestHeader(
                this.user_agent_request_header,
            ),
            userId: new UserSessionUserId(this.user_id),
        });
    }
}
