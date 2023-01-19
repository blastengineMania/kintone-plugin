# kintone blastengine plugin

kintoneにてblastengineを使ってメール送信を行うプラグインです。

## 使い方

plugin.zipをkintoneの管理画面にてアップロードしてください。

## 設定

kintoneの管理画面にて、以下を設定してください。

- APIキー
- ユーザ名
- 送信元名
- 送信元アドレス

## コード

任意のイベント処理にてプラグインを呼び出してください。

[イベント処理の記述方法 – cybozu developer network](https://developer.cybozu.io/hc/ja/articles/201941954)

```js
// 例：編集完了時のイベント
kintone.events.on('app.record.edit.submit.success', async (event) => {
	// 更新内容
	// event.record
	try {
		// delivery_id（数値）が返ってくれば送信成功
		const delivery_id = await window.kintonePlugin.blastengine.transaction({
			to: 'admin@example.com',
			cc: ['manager@example.com'],
			bcc: ['ceo@example.com'],
			subject: 'テストメールの件名',
			text_part: 'テストメールの本文',
			html_part: '<h1>テストメールの本文</h1>'
		});
		// 送信完了時の処理
		event.url = `/k/${event.appId}/show#record=${event.recordId}`;
		return event;
	} catch (e) {
		throw new Error('メール送信に失敗しました');
	}
});
```

## License

MIT

