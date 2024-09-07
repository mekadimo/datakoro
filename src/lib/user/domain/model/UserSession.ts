import type { DateTimeFilter } from "../../../shared/domain/model/Filter";
import type { FieldOrder } from "../../../shared/domain/model/FieldOrder";
import type { SearchCriteria } from "../../../shared/domain/model/SearchCriteria";
import type { TextFilter } from "../../../shared/domain/model/Filter";
import type { UuidFilter } from "../../../shared/domain/model/Filter";
import { DateTimeValueObject } from "../../../shared/domain/model/ValueObject";
import { TextValueObject } from "../../../shared/domain/model/ValueObject";
import { UserConceptId } from "../../../user/domain/model/UserConcept";
import { UuidValueObject } from "../../../shared/domain/model/ValueObject";
import { UserBrowser } from "./UserBrowser";
import { UserPlatform } from "./UserPlatform";

export class PrivateUserSession {
    readonly id: UserSessionId;
    ip: UserSessionIp;
    lastRequestDate: UserSessionLastRequestDate;
    readonly startDate: UserSessionStartDate;
    userAgentRequestHeader: UserSessionUserAgentRequestHeader;
    readonly userId: UserSessionUserId;

    constructor({
        id,
        ip,
        lastRequestDate,
        startDate,
        userAgentRequestHeader,
        userId,
    }: {
        id: UserSessionId;
        ip: UserSessionIp;
        lastRequestDate: UserSessionLastRequestDate;
        startDate: UserSessionStartDate;
        userAgentRequestHeader: UserSessionUserAgentRequestHeader;
        userId: UserSessionUserId;
    }) {
        this.id = id;
        this.ip = ip;
        this.lastRequestDate = lastRequestDate;
        this.startDate = startDate;
        this.userAgentRequestHeader = userAgentRequestHeader;
        this.userId = userId;
    }
}

export enum PrivateUserSessionField {
    Id = "PrivateUserSessionField.Id",
    Ip = "PrivateUserSessionField.Ip",
    LastRequestDate = "PrivateUserSessionField.LastRequestDate",
    StartDate = "PrivateUserSessionField.StartDate",
    UserAgentRequestHeader = "PrivateUserSessionField.UserAgentRequestHeader",
    UserId = "PrivateUserSessionField.UserId",
}

export type PrivateUserSessionFieldOrder = FieldOrder<PrivateUserSessionField>;

export type PrivateUserSessionFilter =
    | { field: PrivateUserSessionField.Id; filter: UuidFilter }
    | { field: PrivateUserSessionField.Ip; filter: TextFilter }
    | { field: PrivateUserSessionField.LastRequestDate; filter: DateTimeFilter }
    | { field: PrivateUserSessionField.StartDate; filter: DateTimeFilter }
    | {
          field: PrivateUserSessionField.UserAgentRequestHeader;
          filter: TextFilter;
      }
    | { field: PrivateUserSessionField.UserId; filter: UuidFilter };

export type PrivateUserSessionSearchCriteria = SearchCriteria<
    PrivateUserSessionFilter,
    PrivateUserSessionFieldOrder
>;

// // TODO: Unique CSRF token per request
export class UserSessionCsrfToken extends UuidValueObject {
    public static generateRandom(): UserSessionCsrfToken {
        const randomValue = UuidValueObject.generateRandomValue();
        return new UserSessionCsrfToken(randomValue);
    }
}

export class UserSessionId extends UuidValueObject {
    public static generateRandom(): UserSessionId {
        const randomValue = UuidValueObject.generateRandomValue();
        return new UserSessionId(randomValue);
    }
}

export class UserSessionIp extends TextValueObject {}

export class UserSessionLastRequestDate extends DateTimeValueObject {}

export class UserSessionStartDate extends DateTimeValueObject {}

export class UserSessionUserAgentRequestHeader extends TextValueObject {
    browser: UserBrowser;
    platform: UserPlatform;

    constructor(inputValue: string) {
        super(inputValue);
        this.browser = UserBrowser.fromUserAgent(this.value);
        this.platform = UserPlatform.fromUserAgent(this.value);
    }
}

export class UserSessionUserId extends UserConceptId {}
