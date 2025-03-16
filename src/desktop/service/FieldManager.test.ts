import { KintoneRestAPIClient } from "@kintone/rest-api-client";
import { beforeEach, describe, expect, it, type Mocked, vi } from "vitest";

import { KintoneSdk } from "../../shared/util/kintoneSdk";

import { FieldManager } from "./FieldManager";

import type { ConfigSchema } from "../../shared/types/Config";
import type { Record } from "@kintone/rest-api-client/lib/src/client/types";

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
          condition: {
            compareType: "field",
            field: "field2",
            operator: "=",
            value: "value2",
          },
        },
      ],
    };

    const fieldManager = new FieldManager(mockConfig, mockkintoneSdk);

    expect(fieldManager.shouldFieldBeDisabled("field1")).toBe(true);
    expect(fieldManager.shouldFieldBeDisabled("field2")).toBe(false);
  });
});
