import type { DateTimeFilter } from "../../../shared/domain/model/Filter";
import type { FieldOrder } from "../../../shared/domain/model/FieldOrder";
import type { SearchCriteria } from "../../../shared/domain/model/SearchCriteria";
import type { TextFilter } from "../../../shared/domain/model/Filter";
import type { UserConceptId } from "./UserConcept";
import type { UserSessionIp } from "./UserSession";
import type { UserSessionUserAgentRequestHeader } from "./UserSession";
import type { UserSessionUserId } from "./UserSession";
import type { UuidFilter } from "../../../shared/domain/model/Filter";
import { PrivateUserSession } from "./UserSession";
import { UserSessionCsrfToken } from "./UserSession";
import { UserSessionId } from "./UserSession";
import { UserSessionLastRequestDate } from "./UserSession";
import { UserSessionStartDate } from "./UserSession";
import { UuidValueObject } from "../../../shared/domain/model/ValueObject";

export class ServerUserSession {
    csrfToken: UserSessionCsrfToken;
    readonly id: UserSessionId;
    ip: UserSessionIp;
    lastRequestDate: UserSessionLastRequestDate;
    readonly secretKey: ServerUserSessionSecretKey;
    readonly startDate: UserSessionStartDate;
    userAgentRequestHeader: UserSessionUserAgentRequestHeader;
    readonly userId: UserSessionUserId;

    constructor(input: {
        csrfToken: UserSessionCsrfToken;
        id: UserSessionId;
        ip: UserSessionIp;
        lastRequestDate: UserSessionLastRequestDate;
        secretKey: ServerUserSessionSecretKey;
        startDate: UserSessionStartDate;
        userAgentRequestHeader: UserSessionUserAgentRequestHeader;
        userId: UserSessionUserId;
    }) {
        this.csrfToken = input.csrfToken;
        this.id = input.id;
        this.ip = input.ip;
        this.lastRequestDate = input.lastRequestDate;
        this.secretKey = input.secretKey;
        this.startDate = input.startDate;
        this.userAgentRequestHeader = input.userAgentRequestHeader;
        this.userId = input.userId;
    }

    public static create(input: {
        userId: UserConceptId;
        ip: UserSessionIp;
        userAgentRequestHeader: UserSessionUserAgentRequestHeader;
    }): ServerUserSession {
        const id = UserSessionId.generateRandom();
        const csrfToken = UserSessionCsrfToken.generateRandom();
        const secretKey = ServerUserSessionSecretKey.generateRandom();

        const currentDate = new Date();
        const startDate = new UserSessionStartDate(currentDate);
        const lastRequestDate = new UserSessionLastRequestDate(currentDate);

        return new ServerUserSession({
            csrfToken: csrfToken,
            id: id,
            ip: input.ip,
            lastRequestDate: lastRequestDate,
            secretKey: secretKey,
            startDate: startDate,
            userAgentRequestHeader: input.userAgentRequestHeader,
            userId: input.userId,
        });
    }

    public toPrivate(): PrivateUserSession {
        return new PrivateUserSession({
            id: this.id,
            ip: this.ip,
            lastRequestDate: this.lastRequestDate,
            startDate: this.startDate,
            userAgentRequestHeader: this.userAgentRequestHeader,
            userId: this.userId,
        });
    }

    public updateAfterLogin(input: {
        ip: UserSessionIp;
        userAgentRequestHeader: UserSessionUserAgentRequestHeader;
    }) {
        this.lastRequestDate = new UserSessionLastRequestDate(new Date());
        this.ip = input.ip;
        this.userAgentRequestHeader = input.userAgentRequestHeader;
    }

    public updateLastRequestDate() {
        this.lastRequestDate = new UserSessionLastRequestDate(new Date());
    }
}

export enum ServerUserSessionField {
    CsrfToken = "ServerUserSessionField.CsrfToken",
    Id = "ServerUserSessionField.Id",
    Ip = "ServerUserSessionField.Ip",
    LastRequestDate = "ServerUserSessionField.LastRequestDate",
    SecretKey = "ServerUserSessionField.SecretKey",
    StartDate = "ServerUserSessionField.StartDate",
    UserAgentRequestHeader = "ServerUserSessionField.UserAgentRequestHeader",
    UserId = "ServerUserSessionField.UserId",
}

export type ServerUserSessionFieldOrder = FieldOrder<ServerUserSessionField>;

export type ServerUserSessionFilter =
    | {
          field: ServerUserSessionField.CsrfToken;
          filter: UuidFilter;
      }
    | { field: ServerUserSessionField.Id; filter: UuidFilter }
    | { field: ServerUserSessionField.Ip; filter: TextFilter }
    | { field: ServerUserSessionField.LastRequestDate; filter: DateTimeFilter }
    | {
          field: ServerUserSessionField.SecretKey;
          filter: UuidFilter;
      }
    | { field: ServerUserSessionField.StartDate; filter: DateTimeFilter }
    | {
          field: ServerUserSessionField.UserAgentRequestHeader;
          filter: TextFilter;
      }
    | { field: ServerUserSessionField.UserId; filter: UuidFilter };

export type ServerUserSessionSearchCriteria = SearchCriteria<
    ServerUserSessionFilter,
    ServerUserSessionFieldOrder
>;

export class ServerUserSessionSecretKey extends UuidValueObject {
    public static generateRandom(): ServerUserSessionSecretKey {
        const randomValue = UuidValueObject.generateRandomValue();
        return new ServerUserSessionSecretKey(randomValue);
    }
}
