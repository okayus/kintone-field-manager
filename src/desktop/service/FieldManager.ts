import { KintoneSdk } from "../../shared/util/kintoneSdk";

import type { ConfigSchema } from "../../shared/types/Config";
import type {
  ExtendedRecord,
  KintoneEventOnCreateShow,
  KintoneEventOnEditShow,
} from "../types/kintone";

export class FieldManager {
  private config: ConfigSchema;
  private kintoneSdk: KintoneSdk;

  constructor(config: ConfigSchema, kintoneSdk: KintoneSdk) {
    this.config = config;
    this.kintoneSdk = kintoneSdk;
  }

  public shouldFieldBeDisabled(fieldCode: string): boolean {
    const fieldConfig = this.config.disabledFields.find(
      (field) => field.fieldCode === fieldCode,
    );
    return fieldConfig ? fieldConfig.disabled : false;
  }

  public getDisabledFields(): { [key: string]: boolean } {
    const disabledFields: { [key: string]: boolean } = {};
    this.config.disabledFields.forEach((field) => {
      disabledFields[field.fieldCode] = field.disabled;
    });
    return disabledFields;
  }
}
