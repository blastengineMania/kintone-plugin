jQuery.noConflict();

(function($, PLUGIN_ID) {
  'use strict';
  // 入力フォームの確認
  const $form = $('.js-submit-settings');
  const elements = $form.serializeArray();
  const $cancelButton = $('.js-cancel-button');
  if (!($form.length > 0 && $cancelButton.length > 0 && elements.length > 0)) {
    throw new Error('Required elements do not exist.');
  }
  // 設定を復元する
  const config = kintone.plugin.app.getConfig(PLUGIN_ID);
  for (const element of elements) {
    $(`[name="${element.name}"]`).val(config[element.name]);
  }
  // 設定を保存する処理
  $form.on('submit', async function(e) {
    e.preventDefault();
    // 保存する値を作成
    const params = {};
    $form.serializeArray().forEach(element => {
      params[element.name] = element.value;
    });
    const hash = await async_digestMessage(`${params.username}${params['api-key']}`);
    const token = await base64Encode(hash);
    // eslint-disable-next-line require-atomic-updates
    params.token = token;
    // 設定を保存
    kintone.plugin.app.setConfig(params, function() {
      alert('プラグイン設定を保存しました');
      window.location.href = '../../flow?app=' + kintone.app.getId();
    });
  });
  // キャンセルボタンを押したときの処理
  $cancelButton.on('click', function() {
    window.location.href = '../../' + kintone.app.getId() + '/plugin/';
  });

  async function async_digestMessage(message) {
    const msgUint8 = new TextEncoder('utf-8').encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(function(b) {
      return b.toString(16).padStart(2, '0');
    }).join('');
  }

  function base64Encode(...parts) {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => {
        const offset = reader.result.indexOf(',') + 1;
        resolve(reader.result.slice(offset));
      };
      reader.readAsDataURL(new Blob(parts));
    });
  }
})(jQuery, kintone.$PLUGIN_ID);
