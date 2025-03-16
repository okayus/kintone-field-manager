import { KintoneRestAPIClient } from "@kintone/rest-api-client";

import { KintoneSdk } from "../shared/util/kintoneSdk";

import { FieldManager } from "./service/FieldManager";

import type {
  ExtendedRecord,
  KintoneEventOnCreateShow,
  KintoneEventOnEditShow,
} from "./types/kintone";
import type { ConfigSchema } from "../shared/types/Config";

// メイン処理
((PLUGIN_ID) => {
  kintone.events.on(
    ["app.record.edit.show", "app.record.create.show"],
    async (event: KintoneEventOnCreateShow | KintoneEventOnEditShow) => {
      const pluginConfig = kintone.plugin.app.getConfig(PLUGIN_ID).config;
      if (!pluginConfig) return;

      const config: ConfigSchema = JSON.parse(pluginConfig).config;
      const restApiClient = new KintoneRestAPIClient();
      const kintoneSdk = new KintoneSdk(restApiClient);
      const fieldManager = new FieldManager(config, kintoneSdk);

      // ここでフィールドのdisabledプロパティを設定する
      const record = event.record;
      const fieldCode = "field1"; // 実際のフィールドコードを使用
      const shouldBeDisabled = fieldManager.shouldFieldBeDisabled(fieldCode);
      record[fieldCode].disabled = shouldBeDisabled;

      return event;
    },
  );
})(kintone.$PLUGIN_ID);
