import { ValueObject } from "../../../shared/domain/model/ValueObject";

export enum UserBrowserEnum {
    Brave = "BrowserEnum.Brave",
    Chrome = "BrowserEnum.Chrome",
    Edge = "BrowserEnum.Edge",
    Firefox = "BrowserEnum.Firefox",
    IceCat = "BrowserEnum.IceCat",
    Midori = "BrowserEnum.Midori",
    NintendoBrowser = "BrowserEnum.NintendoBrowser",
    Opera = "BrowserEnum.Opera",
    Safari = "BrowserEnum.Safari",
    Unknown = "BrowserEnum.Unknown",
}

const PRIORITY_ORDERED_KEYWORDS = [
    // NOTE: Do not change order, since it affects the parsing
    { keyword: "IceCat", enumValue: UserBrowserEnum.IceCat },
    { keyword: "NintendoBrowser", enumValue: UserBrowserEnum.NintendoBrowser },
    { keyword: "Firefox", enumValue: UserBrowserEnum.Firefox },
    { keyword: "Brave", enumValue: UserBrowserEnum.Brave },
    { keyword: "Midori", enumValue: UserBrowserEnum.Midori },
    { keyword: "Edge", enumValue: UserBrowserEnum.Edge },
    { keyword: "Opera", enumValue: UserBrowserEnum.Opera },
    { keyword: "Chrome", enumValue: UserBrowserEnum.Chrome },
    { keyword: "Safari", enumValue: UserBrowserEnum.Safari },
];

export class UserBrowser extends ValueObject<UserBrowserEnum> {
    public static fromUserAgent(userAgentRequestHeader: string): UserBrowser {
        for (const { keyword, enumValue } of PRIORITY_ORDERED_KEYWORDS) {
            if (userAgentRequestHeader.includes(keyword)) {
                return new UserBrowser(enumValue);
            }
        }

        return new UserBrowser(UserBrowserEnum.Unknown);
    }
}
