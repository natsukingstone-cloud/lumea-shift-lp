# LUMEA SHIFT LP — セットアップガイド

## フォルダ構成

```
lumea_shift/
├── index.html          ← メインLP（これをブラウザで開く）
├── css/
│   └── style.css       ← スタイルシート
├── js/
│   └── main.js         ← フォーム送信 / FAQ / アニメーション
├── gas_code.gs         ← GASに貼り付けるサーバーコード
└── images/             ← 素材フォルダ（以下の構成で配置）
    ├── 01_char/
    │   ├── LS_char_01_genkan_tsukare.png
    │   ├── LS_char_02_mirror_sigh.png
    │   ├── LS_char_04_skincare_eye_close.png
    │   └── LS_char_05_ok_sign.png
    ├── 02_product/
    │   ├── LS_prod_01_topdown_beige.jpg    ← video poster画像
    │   ├── LS_prod_03_pump_closeup.png
    │   ├── LS_prod_04_flatlay_linen.jpg
    │   └── LS_prod_06_hand_hold_vertical.png
    ├── 03_mix/
    │   └── LS_mix_04_bag_morning.png       ← ヒーロー背景
    └── 04_video/
        ├── LS_video_00_morning_skin.mp4
        ├── LS_video_02_yuka_mirror.mp4
        ├── LS_video_03_yuka_ippon.mp4      ← ヒーロー動画（推奨）
        └── LS_video_04_bottle_rotate.mp4
```

---

## STEP 1: 素材を配置する

お手元の `LUMEA_SHIFT` フォルダから、上記の構成に合わせてファイルをコピー。

---

## STEP 2: GASを設定する

### 2-1. スプレッドシート作成
1. Google スプレッドシートを新規作成
2. ツール → Apps Script を開く

### 2-2. コードを貼り付け
`gas_code.gs` の中身を Apps Script エディタに貼り付け。
以下の2箇所を変更：

```javascript
const NOTIFY_EMAIL = 'your@email.com';  // 自分のGmailアドレスに変更
```

### 2-3. デプロイ
1. 「デプロイ」→「新しいデプロイ」
2. 種類：**ウェブアプリ**
3. 次のユーザーとして実行：**自分**
4. アクセスできるユーザー：**全員**
5. 「デプロイ」をクリック
6. 発行された URL をコピー

### 2-4. URLをindex.jsに貼り付け
`js/main.js` の先頭：

```javascript
const GAS_ENDPOINT = 'https://script.google.com/macros/s/★ここに貼る★/exec';
```

---

## STEP 3: 動作確認

1. `index.html` をブラウザで開く（ダブルクリックでOK）
2. フォームに入力 → 送信
3. スプレッドシートに記録されているか確認
4. 確認メールが届いているか確認

---

## 動画の差し替えガイド

| セクション | 推奨ファイル | 用途 |
|---|---|---|
| ヒーロー動画 | `LS_video_03_yuka_ippon.mp4` | 1プッシュの工程 |
| 商品動画 | `LS_video_04_bottle_rotate.mp4` | ボトル回転 |
| シーン（朝） | `LS_video_00_morning_skin.mp4` | 朝のルーティン |
| シーン（夜） | `LS_video_02_yuka_mirror.mp4` | 夜の鏡前 |

別の動画に変えたい場合は `index.html` の `src="..."` を変更するだけです。

---

## カラーカスタマイズ

`css/style.css` 先頭のコメントにブランドカラーを記載しています。
変更する場合は以下の値を検索・置換：

| 変数 | 現在値 | 用途 |
|---|---|---|
| Primary | `#EAE3D9` | 背景・カード |
| Accent | `#D4BFA3` | ボーダー・ラベル |
| Dark | `#1C1917` | ダークセクション背景 |

---

## 注意事項

- `LS_video_10_yuka_talking.mp4` などの人物が映る動画は肖像権・権利確認を行ってから使用
- 薬機法NG表現（「改善」「治る」）は使用しない → 「整える」「印象ケア」で統一済み
- SSL環境（https）でないとカメラ・位置情報APIは動作しないが本LPには不要
