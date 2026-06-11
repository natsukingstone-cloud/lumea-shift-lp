/**
 * LUMEA SHIFT — Google Apps Script (GAS)
 * ファイル名: コード.gs
 *
 * 【使い方】
 * 1. Google スプレッドシートを新規作成
 * 2. ツール → Apps Script を開く
 * 3. このコードを貼り付け
 * 4. SHEET_ID, NOTIFY_EMAIL を自分のものに変更
 * 5. デプロイ → 新しいデプロイ → 種類:ウェブアプリ
 *    - 「次のユーザーとして実行」: 自分
 *    - 「アクセスできるユーザー」: 全員
 * 6. 発行されたURLを js/main.js の GAS_ENDPOINT に貼る
 */

// ============================================
// 設定（必ず変更してください）
// ============================================
const SHEET_NAME  = '注文一覧';          // スプレッドシートのシート名
const NOTIFY_EMAIL = 'your@email.com';  // 通知を受け取るメールアドレス

// ============================================
// メイン処理
// ============================================
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // スプレッドシートに書き込み
    writeToSheet(data);

    // 管理者への通知メール
    sendAdminNotification(data);

    // 購入者への確認メール
    sendConfirmationEmail(data);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log('エラー: ' + err.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================
// スプレッドシートへの書き込み
// ============================================
function writeToSheet(data) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let   sheet = ss.getSheetByName(SHEET_NAME);

  // シートがなければ作成 + ヘッダー追加
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      '受付日時', '姓', '名', 'メールアドレス',
      '電話番号', '郵便番号', '住所', 'プラン', '送信元タイムスタンプ'
    ]);
    // ヘッダー行を太字・背景色
    sheet.getRange(1, 1, 1, 9)
      .setFontWeight('bold')
      .setBackground('#EAE3D9');
  }

  sheet.appendRow([
    new Date(),
    data.lastName   || '',
    data.firstName  || '',
    data.email      || '',
    data.phone      || '',
    data.zip        || '',
    data.address    || '',
    data.plan       || '',
    data.timestamp  || ''
  ]);
}

// ============================================
// 管理者通知メール
// ============================================
function sendAdminNotification(data) {
  const planLabel = data.plan === 'subscription_first'
    ? '定期購入・初回 ¥1,980'
    : '通常購入 ¥3,980';

  const subject = `【LUMEA SHIFT】新規注文 — ${data.lastName}${data.firstName} 様`;

  const body = `
新しい注文が届きました。

━━━━━━━━━━━━━━━
注文情報
━━━━━━━━━━━━━━━
お名前    : ${data.lastName} ${data.firstName}
メール    : ${data.email}
電話番号  : ${data.phone}
郵便番号  : ${data.zip}
住所      : ${data.address}
プラン    : ${planLabel}
受付日時  : ${new Date().toLocaleString('ja-JP')}
━━━━━━━━━━━━━━━

スプレッドシートも合わせてご確認ください。
  `.trim();

  MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
}

// ============================================
// 購入者への確認メール
// ============================================
function sendConfirmationEmail(data) {
  if (!data.email) return;

  const planLabel = data.plan === 'subscription_first'
    ? '定期購入・初回 ¥1,980（送料無料）'
    : '通常購入 ¥3,980（送料¥550）';

  const subject = '【LUMEA SHIFT】ご注文を受け付けました';

  const body = `
${data.lastName} ${data.firstName} 様

この度はLUMEA SHIFTをご注文いただき、ありがとうございます。
以下の内容でご注文を受け付けました。

━━━━━━━━━━━━━━━
ご注文内容
━━━━━━━━━━━━━━━
商品名    : LUMEA SHIFT Serum 50mL
プラン    : ${planLabel}
お届け先  : 〒${data.zip} ${data.address}
━━━━━━━━━━━━━━━

通常1〜2営業日以内に発送のご連絡をいたします。

※ 解約・変更は次回発送の5日前までに下記までご連絡ください。
※ 回数縛りはありません。

━━━━━━━━━━━━━━━
LUMEA BEAUTY株式会社
support@lumea-beauty.jp
平日 10:00〜18:00（土日祝休み）
〒150-0001 東京都渋谷区神宮前3-10-5
━━━━━━━━━━━━━━━

※ このメールは自動送信です。返信はできません。
  `.trim();

  MailApp.sendEmail(data.email, subject, body);
}

// ============================================
// テスト用関数（GASエディタから手動実行可）
// ============================================
function testDoPost() {
  const mockData = {
    postData: {
      contents: JSON.stringify({
        lastName: 'テスト',
        firstName: '太郎',
        email: 'test@example.com',
        phone: '090-1234-5678',
        zip: '150-0001',
        address: '東京都渋谷区テスト1-2-3',
        plan: 'subscription_first',
        timestamp: new Date().toLocaleString('ja-JP')
      })
    }
  };
  const result = doPost(mockData);
  Logger.log(result.getContent());
}
