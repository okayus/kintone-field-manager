import type { Record as KintoneRecord } from "@kintone/rest-api-client/lib/src/client/types/record";

export type ExtendedRecord = {
  [fieldCode: string]: KintoneRecord[string] & { disabled?: boolean };
};

export interface KintoneEventOnCreateShow {
  type: string;
  appId: number;
  record: ExtendedRecord;
  reuse: boolean;
}

export interface KintoneEventOnEditShow {
  type: string;
  appId: number;
  record: ExtendedRecord;
  recordId: number;
}
