import { UuidValueObject } from "../../../shared/domain/model/ValueObject";

export class ConceptId extends UuidValueObject {
    public static generateRandom(): ConceptId {
        const randomValue = UuidValueObject.generateRandomValue();
        return new ConceptId(randomValue);
    }
}

export const ID_DATAKORO_OPERATION = new ConceptId(
    "111AB302D6A64E7999C9C87242D91056",
);
export const ID_DATAKORO_TRANSACTION = new ConceptId(
    "4ADD74548D2D46609D6B770816889501",
);
export const ID_DATAKORO_USER = new ConceptId(
    "ECB2E0C4270340BAB8730DB1E46C02B4",
);
export const ID_DATAKORO_FIRST_OPERATION = new ConceptId(
    "0d53f7a7-1eff-48b9-a01a-69a5a148a1ac",
);
export const ID_DATAKORO_FIRST_TRANSACTION = new ConceptId(
    "387A210178DE4FCE8F454B878EE49D0F",
);
export const ID_DATAKORO_FIRST_USER = new ConceptId(
    "3424E850A3A142B3A67F870FBA7B43A6",
);

export const ID_CONCEPT = new ConceptId("CC915020DD1E4F78B94F95D9A271179E");
export const ID_ABSTRACTION = new ConceptId("437857FFE7E7497592445C465E177804");
export const ID_PROPERTY = new ConceptId("8A764E33677F44B494082EA3826D4B3B");
export const ID_QUALITY = new ConceptId("E88775D4853448309F09F29B638675B4");

export const ID_DATAKORO_RELATION_RULE = new ConceptId(
    "C03837EC7045430F89C16E16E3312C72",
);
export const ID_INACTIVE_DATAKORO_RELATION_RULE = new ConceptId(
    "3E58F57C5FEE471E89D7238A34C344B6",
);
export const ID_DATAKORO_ERROR = new ConceptId(
    "7F8913ED40F24958811EF232C8D7B493",
);
export const ID_NUMBER = new ConceptId("21E9B2D9958B418094BBB569A023D1DC");
export const ID_DATAKORO_NUMBER = new ConceptId(
    "729A3344C79B4B78A9805CEC853FA0D6",
);
export const ID_TEXT = new ConceptId("95645A4F87AA4B438B0B10D012EE8E67");
export const ID_DATAKORO_TEXT = new ConceptId(
    "F92F08F600024D09830579DC97C386FF",
);
export const ID_MAGNITUDE = new ConceptId("CAB50FF3A47841A8A2AADC2F1647AADB");
export const ID_DATAKORO_MAGNITUDE = new ConceptId(
    "8F85100223B8419F88F887887C64DC73",
);
export const ID_MEASUREMENT_UNIT = new ConceptId(
    "73494F98F7BA475BA04EB7EAC5B65269",
);

export const ID_LANGUAGE = new ConceptId("4FC8F487C7444EBA855C815BD5E214E4");
export const ID_LINGUISTIC_EXPRESSION = new ConceptId(
    "13240A49995E4521AD822050802D19C6",
);
export const ID_SIGNIFIER = new ConceptId("3DC558EF6F664C53BC755E8AF9FF6D4A");
export const ID_VERBAL_SIGNIFIER = new ConceptId(
    "D4DFEDDFF48C4634B63E445417BF7289",
);
export const ID_NAME = new ConceptId("4460969858484C64A109960D67F5C925");

export const ID_LANGUAGE_ENGLISH = new ConceptId(
    "0D781D564AF94BC39719324164963DC1",
);
export const ID_LANGUAGE_SPANISH = new ConceptId(
    "6142064F5D57488C8AB9B3FC6FACC0A4",
);
export const ID_LANGUAGE_JAPANESE = new ConceptId(
    "6FBC341EEE38495FBA63020BC12A1ADB",
);
export const ID_LANGUAGE_MANDARIN_CHINESE = new ConceptId(
    "1BAD39FB73CF466FB536AC846DECACA6",
);
export const ID_LANGUAGE_MEKARANTO = new ConceptId(
    "763BDAB612C74DB9A1302AFD30760C57",
);

export const ID_DATAKORO_VIEW = new ConceptId(
    "5b99ec7e-e54c-4ae1-bef5-b79852a2b062",
);
export const ID_DATAKORO_CONCEPT_VIEW = new ConceptId(
    "e84b8135-d45a-4245-ad38-faec049c4afe",
);
export const ID_DATAKORO_ABSTRACTION_VIEW_ = new ConceptId(
    "6700e6eb-268a-44a2-8a5b-58faaff4e50a",
);

export const ID_DATAKORO_VIEW_CONCEPT = new ConceptId(
    "9c50d80f-0766-4bbd-96a5-1c9de4159f34",
);

export const ID_DATAKORO_LOGIN = new ConceptId(
    "a656665c-8fc7-4f21-acac-bf8d3164fae4",
);
export const ID_DATAKORO_VIEW_DATAKORO_LOGIN = new ConceptId(
    "0fe917b1-6bcc-4d92-88df-d6182ed19404",
);

export const ID_DATAKORO_SEARCH = new ConceptId(
    "c5beeb7a-13d7-4d46-a401-09ffb857cb36",
);
export const ID_DATAKORO_VIEW_DATAKORO_SEARCH = new ConceptId(
    "fdcfba6b-ae29-4a41-98dc-3fe5a8dd5b73",
);
