import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { beforeEach, describe, expect, it, type Mocked, vi } from "vitest";

import { KintoneSdk } from "../../shared/util/kintoneSdk";

import { FieldManager } from "./FieldManager";

import type { ConfigSchema } from "../../shared/types/Config";
import type { ExtendedRecord } from "../types/kintone";

vi.mock("../../shared/util/kintoneSdk");

describe("FieldManager", () => {
  let mockkintoneSdk: Mocked<KintoneSdk>;
  let mockRestApiClient: Mocked<KintoneRestAPIClient>;
  let kintone: any;

  beforeEach(() => {
    kintone = {
      app: {
        getQueryCondition: vi.fn(),
      },
    };
    global.kintone = kintone;

    mockRestApiClient = {
      record: {
        getRecords: vi.fn(),
      },
    } as unknown as Mocked<KintoneRestAPIClient>;
    mockkintoneSdk = new KintoneSdk(mockRestApiClient) as Mocked<KintoneSdk>;
    mockkintoneSdk.getRecords = vi.fn();
  });

  it("指定したフィールドがdisabledであるべきかを判定する", () => {
    const mockConfig: ConfigSchema = {
      disabledFields: [
        {
          fieldCode: "field1",
          disabled: true,
        },
      ],
    };

    const fieldManager = new FieldManager(mockConfig, mockkintoneSdk);

    const mockRecord = {
      field1: {
        type: "SINGLE_LINE_TEXT",
        value: "value1",
        disabled: false,
      },
      field2: {
        type: "SINGLE_LINE_TEXT",
        value: "value2",
        disabled: false,
      },
    } as ExtendedRecord;

    expect(fieldManager.shouldFieldBeDisabled("field1", mockRecord)).toBe(true);
    expect(fieldManager.shouldFieldBeDisabled("field2", mockRecord)).toBe(
      false,
    );
  });

  it("複数のフィールドがdisabledであるべきかを判定する", () => {
    const mockConfig: ConfigSchema = {
      disabledFields: [
        {
          fieldCode: "field1",
          disabled: true,
        },
        {
          fieldCode: "field3",
          disabled: true,
        },
      ],
    };

    const fieldManager = new FieldManager(mockConfig, mockkintoneSdk);

    const mockRecord = {
      field1: {
        type: "SINGLE_LINE_TEXT",
        value: "value1",
        disabled: false,
      },
      field3: {
        type: "SINGLE_LINE_TEXT",
        value: "value3",
        disabled: false,
      },
    } as ExtendedRecord;

    expect(fieldManager.shouldFieldBeDisabled("field1", mockRecord)).toBe(true);
    expect(fieldManager.shouldFieldBeDisabled("field3", mockRecord)).toBe(true);
  });

  it("複数のフィールドのdisabled状態を取得する", () => {
    const mockConfig: ConfigSchema = {
      disabledFields: [
        {
          fieldCode: "field1",
          disabled: true,
        },
        {
          fieldCode: "field3",
          disabled: true,
        },
      ],
    };

    const fieldManager = new FieldManager(mockConfig, mockkintoneSdk);

    const mockRecord = {
      field1: {
        type: "SINGLE_LINE_TEXT",
        value: "value1",
        disabled: false,
      },
      field2: {
        type: "SINGLE_LINE_TEXT",
        value: "value2",
        disabled: false,
      },
      field3: {
        type: "SINGLE_LINE_TEXT",
        value: "value3",
        disabled: false,
      },
      field4: {
        type: "SINGLE_LINE_TEXT",
        value: "value4",
        disabled: false,
      },
    } as ExtendedRecord;

    const disabledFields = fieldManager.getDisabledFields(mockRecord);

    expect(disabledFields).toEqual({
      field1: true,
      field3: true,
    });
  });

  it("フィールドの条件に基づいてdisabled状態を判定する", () => {
    const mockConfig: ConfigSchema = {
      disabledFields: [
        {
          fieldCode: "field1",
          disabled: true,
          condition: {
            compareType: "field",
            field: "field2",
            operator: "=",
            value: "field3",
          },
        },
      ],
    };

    const fieldManager = new FieldManager(mockConfig, mockkintoneSdk);

    const mockRecord = {
      field1: {
        type: "SINGLE_LINE_TEXT",
        value: "value1",
        disabled: false,
      },
      field2: {
        type: "SINGLE_LINE_TEXT",
        value: "value2",
        disabled: false,
      },
      field3: {
        type: "SINGLE_LINE_TEXT",
        value: "value2",
        disabled: false,
      },
    } as ExtendedRecord;

    expect(fieldManager.shouldFieldBeDisabled("field1", mockRecord)).toBe(true);

    mockRecord.field3.value = "differentValue";
    expect(fieldManager.shouldFieldBeDisabled("field1", mockRecord)).toBe(
      false,
    );
  });
});
