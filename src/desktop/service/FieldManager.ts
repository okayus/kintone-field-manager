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

  public shouldFieldBeDisabled(
    fieldCode: string,
    record: ExtendedRecord,
  ): boolean {
    const fieldConfig = this.config.disabledFields.find(
      (field) => field.fieldCode === fieldCode,
    );
    if (!fieldConfig) return false;

    if (
      fieldConfig.condition &&
      fieldConfig.condition.compareType === "field"
    ) {
      return this.compareFieldValues(fieldConfig.condition, record);
    }

    return fieldConfig.disabled;
  }

  private compareFieldValues(condition: any, record: ExtendedRecord): boolean {
    const fieldValue = record[condition.field]?.value;
    const compareValue = record[condition.value]?.value;
    if (fieldValue === undefined || compareValue === undefined) return false;

    switch (condition.operator) {
      case "=":
        return fieldValue === compareValue;
      case "!=":
        return fieldValue !== compareValue;
      case ">":
        return fieldValue > compareValue;
      case "<":
        return fieldValue < compareValue;
      case ">=":
        return fieldValue >= compareValue;
      case "<=":
        return fieldValue <= compareValue;
      default:
        return false;
    }
  }

  public getDisabledFields(record: ExtendedRecord): { [key: string]: boolean } {
    const disabledFields: { [key: string]: boolean } = {};
    this.config.disabledFields.forEach((field) => {
      disabledFields[field.fieldCode] = this.shouldFieldBeDisabled(
        field.fieldCode,
        record,
      );
    });
    return disabledFields;
  }
}
