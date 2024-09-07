import { ValueObject } from "../../../shared/domain/model/ValueObject";

export enum UserPlatformEnum {
    Android,
    ArchLinux,
    ChromeOs,
    ChromecastOs,
    Debian,
    DragonFlyBsd,
    Fedora,
    FreeBsd,
    Gentoo,
    IPad,
    IPhone,
    Mac,
    NetBsd,
    NintendoSwitch,
    OpenBsd,
    OpenSuse,
    PlayStation,
    RedHat,
    Ubuntu,
    Unknown,
    UnknownLinux,
    Windows,
    Xbox,
}

const PRIORITY_ORDERED_KEYWORDS = [
    // NOTE: Do not change order, since it affects the parsing
    { keyword: "Nintendo Switch", enumValue: UserPlatformEnum.NintendoSwitch },
    { keyword: "PlayStation", enumValue: UserPlatformEnum.PlayStation },
    { keyword: "Playstation", enumValue: UserPlatformEnum.PlayStation },
    { keyword: "Xbox", enumValue: UserPlatformEnum.Xbox },
    { keyword: "FreeBSD", enumValue: UserPlatformEnum.FreeBsd },
    { keyword: "OpenBSD", enumValue: UserPlatformEnum.OpenBsd },
    { keyword: "NetBSD", enumValue: UserPlatformEnum.NetBsd },
    { keyword: "DragonFly", enumValue: UserPlatformEnum.DragonFlyBsd },
    { keyword: "CrKey", enumValue: UserPlatformEnum.ChromecastOs },
    { keyword: "Android", enumValue: UserPlatformEnum.Android },
    { keyword: "CrOS", enumValue: UserPlatformEnum.ChromeOs },
    { keyword: "Red Hat", enumValue: UserPlatformEnum.RedHat },
    { keyword: "Fedora", enumValue: UserPlatformEnum.Fedora },
    { keyword: "Ubuntu", enumValue: UserPlatformEnum.Ubuntu },
    { keyword: "Debian", enumValue: UserPlatformEnum.Debian },
    { keyword: "openSUSE", enumValue: UserPlatformEnum.OpenSuse },
    { keyword: "Gentoo", enumValue: UserPlatformEnum.Gentoo },
    { keyword: "Arch Linux", enumValue: UserPlatformEnum.ArchLinux },
    { keyword: "Linux", enumValue: UserPlatformEnum.UnknownLinux },
    { keyword: "LINUX", enumValue: UserPlatformEnum.UnknownLinux },
    { keyword: "iPhone", enumValue: UserPlatformEnum.IPhone },
    { keyword: "iphone", enumValue: UserPlatformEnum.IPhone },
    { keyword: "iPad", enumValue: UserPlatformEnum.IPad },
    { keyword: "ipad", enumValue: UserPlatformEnum.IPad },
    { keyword: "Mac OS", enumValue: UserPlatformEnum.Mac },
    { keyword: "Macintosh", enumValue: UserPlatformEnum.Mac },
    { keyword: "Windows", enumValue: UserPlatformEnum.Windows },
];

export class UserPlatform extends ValueObject<UserPlatformEnum> {
    public static fromUserAgent(userAgentRequestHeader: string): UserPlatform {
        for (const { keyword, enumValue } of PRIORITY_ORDERED_KEYWORDS) {
            if (userAgentRequestHeader.includes(keyword)) {
                return new UserPlatform(enumValue);
            }
        }

        return new UserPlatform(UserPlatformEnum.Unknown);
    }
}
