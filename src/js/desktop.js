jQuery.noConflict();

(function($, PLUGIN_ID) {
  'use strict';
  const url = 'https://app.engn.jp/api/v1/deliveries/transaction';
  window.kintonePlugin = {};
  window.kintonePlugin.blastengine = {
    transaction: async (params) => {
      const config = kintone.plugin.app.getConfig(PLUGIN_ID);
      if (!params.from) {
        params.from = {
          email: config['from-address'],
          name: config['from-name'],
        };
      }
      if (!params.from.email) params.from.email = config['from-address'];
      if (!params.from.name) params.from.name = config['from-name'];

      if (!params.to) throw new Error('toパラメレーター（宛先）は必須です');
      if (!params.subject) throw new Error('subjectパラメレーター（件名）は必須です');
      if (!params.text_part) throw new Error('text_partパラメレーター（テキスト本文）は必須です');
      if (!params.encode) params.encode = 'UTF-8';
      const [body, status] = await kintone.plugin.app.proxy(
        PLUGIN_ID,
        url,
        'POST',
        {
          'Authorization': `Bearer ${config.token}`,
          'Content-Type': 'application/json'
        }, params);
      try {
        const json = JSON.parse(body);
        if (json.delivery_id && status === 201) {
          return json.delivery_id;
        }
      } catch (e) {
        throw new Error(body);
      }
    }
  };
})(jQuery, kintone.$PLUGIN_ID);
