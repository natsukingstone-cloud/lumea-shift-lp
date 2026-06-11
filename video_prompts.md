# LUMEA SHIFT — 動画制作プロンプト集

ターゲット: 安藤由香（28歳・IT企業・22時帰宅・一人暮らし）
世界観: ミニマル・清潔感・生活感あり・押し売りNG
使用ツール: Kling AI / Runway / Pika / CapCut など

---

## ★ 最優先①「テクスチャ動画」

### 用途
商品説明セクション・成分セクション直下に配置
「ベタつかない・軽い・馴染む」を視覚で証明する最重要動画

### Kling AI プロンプト（英語）
```
Close-up shot of a woman's hand applying one pump of lightweight serum onto the back of her hand.
The serum spreads easily and absorbs quickly without any stickiness.
Warm, soft lighting. Minimalist white background or linen texture surface.
Slow motion, 4-6 seconds. Clean and satisfying aesthetic.
No text overlay. Vertical 9:16 format.
```

### 日本語メモ
- 手の甲に1プッシュ→指で伸ばす→スッと消える、の3ステップ
- ベタつき感ゼロを見せる（指がサラっと離れる）
- 照明：温かみのある白・ベージュ系
- BGMなし or lofi系の環境音

---

## ★ 最優先②「22時帰宅ルーティン動画」

### 用途
ヒーロー背景動画（由佳のぼかし背景を置き換え）
または、ペインセクション直下の「共感動画」として使用

### Kling AI プロンプト（英語）
```
A young Japanese woman in casual home clothes arrives home at night, visibly tired.
She sets down her bag, sits on the sofa for a moment, then walks to the washroom.
After washing her face, she applies one pump of serum from a minimal bottle and sighs with relief.
Natural indoor lighting, warm and cozy atmosphere. No makeup, authentic feel.
Vertical 9:16 format, 15-20 seconds total.
```

### 日本語メモ
- 帰宅→ソファ→洗顔→1プッシュ→「これでいいか」の表情
- 部屋着・すっぴん風・生活感あり
- 「完璧にやろうとしない」を体現する自然な動き
- テロップ案：「22時帰宅。洗顔と、これだけ。」

---

## 推奨③「朝3秒ルーティン動画」

### 用途
シーン（朝）セクションの動画差し替え
`LS_video_00_morning_skin.mp4` の代替

### Kling AI プロンプト（英語）
```
Morning routine video. A young woman in a white shirt quickly applies serum before heading to work.
One pump, spread over face in 3 seconds, done. She looks fresh and confident.
Bright natural morning light. Minimal bathroom or dressing room setting.
Vertical 9:16 format, 8-10 seconds.
```

### 日本語メモ
- 白シャツ・出勤前・明るい朝の光
- 「3秒で完了」を体感させる素早いテンポ
- 最後に鏡を見て小さくうなずく表情
- テロップ案：「朝も、3秒だけ。」

---

## 推奨④「ボトル商品動画（改良版）」

### 用途
商品説明セクションのメイン動画
既存の `LS_video_04_bottle_rotate.mp4` の高品質版

### Kling AI プロンプト（英語）
```
Product showcase video of a minimalist skincare serum bottle.
The bottle slowly rotates on a marble or linen surface.
Soft studio lighting with warm highlights. Gold pump detail visible.
Clean, luxury aesthetic. No text. Vertical 9:16 format, 5-8 seconds loop.
```

### 日本語メモ
- 大理石 or リネン素地の上でゆっくり回転
- ゴールドのポンプが映えるアングル
- 高級感＋ミニマルの世界観
- ループ素材として使用

---

## 推奨⑤「SNS Reels用・共感ショート動画」

### 用途
Instagram Reels / TikTok 広告素材
LPへの流入を増やすための動画

### Kling AI プロンプト（英語）
```
Short vertical video (15 seconds) for Instagram Reels.
Scene 1 (0-5s): Tired woman on sofa at night, scrolling phone, ignoring skincare products on the shelf.
Scene 2 (5-10s): She reluctantly picks up one minimalist bottle and applies it quickly.
Scene 3 (10-15s): She looks relieved, smiles slightly. Text overlay: "1本だけ、にした。"
Authentic, UGC-style aesthetic. Warm indoor lighting. No heavy effects.
```

### 日本語メモ
- UGC（一般ユーザー風）のざっくりした質感
- テロップ中心・BGMはlofi
- ぼそっとした語り口（TTS or 本人声）
- ハッシュタグ案: #時短スキンケア #ずぼらケア #オールインワン

---

## 制作時の共通ルール

| 項目 | 指定 |
|---|---|
| フォーマット | 縦型 9:16（1080×1920px）|
| 尺 | ヒーロー用: 15〜20秒 / 商品用: 5〜10秒ループ |
| 色温度 | 暖色系（3200〜4500K）|
| 表現NG | 「改善する」「治る」などの薬機法NG表現 |
| テロップNG | 過剰な効果音・派手なトランジション |
| ウォーターマーク | 必ず透かしなし版で書き出す |

---

## LPへの組み込み方

```html
<!-- 動画ファイルを images/04_video/ に入れてsrcを変更するだけ -->

<!-- ヒーロー背景（由佳ぼかし） -->
src="images/04_video/LS_video_新ファイル名.mp4"

<!-- ヒーロー前面（商品） -->
src="images/04_video/LS_video_新ファイル名.mp4"
```
