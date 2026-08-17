/**
 * LUMEA SHIFT LP — main.js
 *
 * 機能:
 *  1. GAS購入フォーム送信
 *  2. FAQアコーディオン
 *  3. スクロールアニメーション
 *  4. スティッキーナビ制御
 *  5. スムーズスクロール（CTAボタン）
 */

// =========================================
// 【重要】GASのエンドポイントURLをここに貼る
// =========================================
const GAS_ENDPOINT = 'https://script.google.com/macros/s/AKfycby-FL9PPqCJUvP1ebatVjhTs4ee7woaKX19aYUls0kqJWhbMOEic3RfFf1nBKtui4Drvg/exec';
// ↑ GASデプロイ後に発行される URL に置き換えてください

// =========================================
// 1. GAS購入フォーム送信
// =========================================
const form = document.getElementById('purchaseForm');
const submitBtn = document.getElementById('submitBtn');
const formMsg = document.getElementById('formMsg');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // バリデーション
    if (!validateForm()) return;

    // UI: ローディング状態
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-submit-text').hidden = true;
    submitBtn.querySelector('.btn-submit-loading').hidden = false;
    formMsg.className = 'form-msg';
    formMsg.style.display = 'none';

    // フォームデータ収集
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    data.timestamp = new Date().toLocaleString('ja-JP');

    try {
      // GASへPOST
      // ※ GASはCORSの関係でno-corsを使用
      await fetch(GAS_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      // 成功表示（no-corsのためステータス取得不可→成功扱い）
      showMsg('success', 'ご注文を受け付けました！確認メールをお送りします。\n通常1〜2営業日以内にご連絡いたします。');
      form.reset();
      // 完了セクションへスクロール
      formMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });

    } catch (err) {
      showMsg('error', '送信中にエラーが発生しました。時間をおいて再度お試しいただくか、support@lumea-beauty.jp までご連絡ください。');
      console.error('GAS送信エラー:', err);
    } finally {
      submitBtn.disabled = false;
      submitBtn.querySelector('.btn-submit-text').hidden = false;
      submitBtn.querySelector('.btn-submit-loading').hidden = true;
    }
  });
}

function validateForm() {
  let valid = true;
  const required = form.querySelectorAll('[required]');

  required.forEach(field => {
    field.classList.remove('error');
    if (field.type === 'checkbox') {
      const group = field.closest('.form-group');
      if (!field.checked) {
        if (group) group.style.outline = '2px solid #e74c3c';
        valid = false;
      } else {
        if (group) group.style.outline = 'none';
      }
    } else if (!field.value.trim()) {
      field.classList.add('error');
      valid = false;
    }
  });

  // メール形式チェック
  const emailField = document.getElementById('email');
  if (emailField && emailField.value && !emailField.value.includes('@')) {
    emailField.classList.add('error');
    valid = false;
  }

  if (!valid) {
    showMsg('error', '必須項目をすべてご入力ください。');
  }
  return valid;
}

function showMsg(type, text) {
  formMsg.className = `form-msg ${type}`;
  formMsg.textContent = text;
  formMsg.style.display = 'block';
}

// =========================================
// 2. FAQアコーディオン
// =========================================
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');

  if (!q || !a) return;

  const toggle = () => {
    const isOpen = q.getAttribute('aria-expanded') === 'true';
    // 全部閉じる
    faqItems.forEach(i => {
      i.querySelector('.faq-q')?.setAttribute('aria-expanded', 'false');
      i.querySelector('.faq-a')?.classList.remove('open');
    });
    // クリックしたものだけトグル
    if (!isOpen) {
      q.setAttribute('aria-expanded', 'true');
      a.classList.add('open');
    }
  };

  q.addEventListener('click', toggle);
  q.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
  });
});

// =========================================
// 3. スクロールフェードイン
// =========================================
const fadeEls = document.querySelectorAll(
  '.pain-item, .feat-card, .voice-card, .scene-card, .faq-item, .price-card, .product-hero, .ingr-layout'
);

fadeEls.forEach(el => el.classList.add('fade-up'));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
);

fadeEls.forEach(el => observer.observe(el));

// =========================================
// 4. スティッキーナビ スクロール検知
// =========================================
const stickyNav = document.getElementById('stickyNav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    stickyNav?.classList.add('scrolled');
  } else {
    stickyNav?.classList.remove('scrolled');
  }
}, { passive: true });

// =========================================
// 5. CTAボタン → フォームへスクロール
// =========================================
document.querySelectorAll('.js-scroll-to-form').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById('purchase-form');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // 少し遅延して最初のフィールドにフォーカス
      setTimeout(() => {
        document.getElementById('lastName')?.focus();
      }, 600);
    }
  });
});

// =========================================
// 6. 郵便番号→住所 自動入力（zipcloud API）
// =========================================
const zipBtn = document.getElementById('zipSearchBtn');
const zipField = document.getElementById('zip');
const addressField = document.getElementById('address');

if (zipBtn && zipField && addressField) {
  zipBtn.addEventListener('click', async () => {
    const zip = zipField.value.replace(/[^0-9]/g, '');
    if (zip.length !== 7) {
      zipField.classList.add('error');
      return;
    }
    zipBtn.textContent = '検索中…';
    zipBtn.disabled = true;
    try {
      const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zip}`);
      const data = await res.json();
      if (data.results) {
        const r = data.results[0];
        addressField.value = r.address1 + r.address2 + r.address3;
        zipField.classList.remove('error');
      } else {
        zipField.classList.add('error');
        zipBtn.textContent = '見つかりません';
        setTimeout(() => { zipBtn.textContent = '住所を自動入力'; }, 2000);
      }
    } catch {
      zipBtn.textContent = 'エラー';
      setTimeout(() => { zipBtn.textContent = '住所を自動入力'; }, 2000);
    } finally {
      zipBtn.disabled = false;
      if (zipBtn.textContent === '検索中…') zipBtn.textContent = '住所を自動入力';
    }
  });
}

// =========================================
// 7. ヒーロー動画スライダー
// =========================================
const heroSlider = document.getElementById('heroSlider');
if (heroSlider) {
  const slides = Array.from(heroSlider.querySelectorAll('.hero-slide'));
  const dots = Array.from(document.querySelectorAll('#heroSliderDots .dot'));
  const prevBtn = document.getElementById('heroPrev');
  const nextBtn = document.getElementById('heroNext');
  let current = 0;
  let autoTimer = null;

  function goToSlide(index) {
    const newIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      const video = slide.querySelector('video');
      if (i === newIndex) {
        slide.classList.add('is-active');
        if (video) {
          video.currentTime = 0;
          video.play().catch(() => {});
        }
      } else {
        slide.classList.remove('is-active');
        if (video) video.pause();
      }
    });

    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === newIndex));
    current = newIndex;
  }

  function resetAutoTimer() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = setInterval(() => goToSlide(current + 1), 5000);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goToSlide(i); resetAutoTimer(); });
  });
  prevBtn?.addEventListener('click', () => { goToSlide(current - 1); resetAutoTimer(); });
  nextBtn?.addEventListener('click', () => { goToSlide(current + 1); resetAutoTimer(); });

  // スワイプ対応
  let touchStartX = 0;
  heroSlider.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  heroSlider.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? goToSlide(current - 1) : goToSlide(current + 1);
      resetAutoTimer();
    }
  }, { passive: true });

  resetAutoTimer();
}

// =========================================
// 8. 全成分表トグル
// =========================================
const ingrToggle = document.getElementById('ingrTableToggle');
const ingrWrap = document.getElementById('ingrTableWrap');
if (ingrToggle && ingrWrap) {
  ingrToggle.addEventListener('click', () => {
    const isOpen = ingrWrap.classList.toggle('open');
    ingrToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    ingrToggle.firstChild.textContent = isOpen ? '全成分表をとじる ' : '全成分表をみる ';
  });
}

// =========================================
// 9. 同意チェックボックス：チェック時に即赤枠を解除
// =========================================
const agreeCheckbox = document.getElementById('agree');
if (agreeCheckbox) {
  agreeCheckbox.addEventListener('change', () => {
    const group = agreeCheckbox.closest('.form-group');
    if (group) group.style.outline = agreeCheckbox.checked ? 'none' : '';
  });
}

// =========================================
// 10. チャットウィジェット（課題 段階3: Google Sheets + DeepSeek API連携）
//
//   Google Sheets（category, question, answer, priority の4列）をCSVとしてfetchし、
//   PapaParseでパースした内容をシステムプロンプトに埋め込んで、
//   Railwayにデプロイしたバックエンド（/chat）へPOSTする。
//   バックエンドがDeepSeek APIを呼び出して回答を生成し、その結果を画面に表示する。
//   APIキーはバックエンド側(process.env)にのみ存在し、フロントには一切露出しない。
//
//   ハルシネーション対策:
//     ・システムプロンプトで「ナレッジに書かれている内容のみを根拠に回答すること」
//       「ナレッジに書かれていない質問には『わかりかねます。担当者にお問い合わせ
//       ください。』とだけ答え、推測で答えないこと」を明示的に指示している。
//     ・Markdown記法（**太字**など）を使わず、プレーンテキストで答えるよう指示している
//       （このチャットUIはプレーンテキストしか表示しないため）。
//     ・temperatureを低め(0.3)に設定（バックエンド側）し、回答のブレを抑えている。
// =========================================

// Railwayにデプロイしたバックエンドの /chat エンドポイント
const CHAT_API_URL = 'https://lumea-shift-backend-production.up.railway.app/chat';

// Google Sheets「LUMEA SHIFT チャットボット用ナレッジ（段階3）」を
// ウェブに公開(CSV形式)して発行されたURL（列: category, question, answer, priority）
const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTyCNjI8C_7Q1052MJHljXD9hUx6RH-7WWXb4xvelC9lAHWIZBGTkcNvgSD8Qkn1Ta7k38av76HkEl2/pub?output=csv';

const chatToggleBtn = document.getElementById('chatToggleBtn');
const chatWindow = document.getElementById('chatWindow');
const chatCloseBtn = document.getElementById('chatCloseBtn');
const chatMessages = document.getElementById('chatMessages');
const chatInputForm = document.getElementById('chatInputForm');
const chatInput = document.getElementById('chatInput');
const chatSendBtn = document.getElementById('chatSendBtn');

if (chatToggleBtn && chatWindow && chatInputForm && chatInput && chatMessages) {

  // ----- 開閉制御 -----
  function openChat() {
    chatWindow.classList.add('is-open');
    chatWindow.setAttribute('aria-hidden', 'false');
    chatToggleBtn.classList.add('is-open');
    chatToggleBtn.setAttribute('aria-expanded', 'true');
    chatToggleBtn.setAttribute('aria-label', 'チャットを閉じる');
    // 開いたあとに入力欄へフォーカス（アニメーション終了を待つ）
    setTimeout(() => chatInput.focus(), 320);
    // Google Sheetsのナレッジを先読みしておく（初回の回答を速くするため）
    loadKnowledge();
  }

  function closeChat() {
    chatWindow.classList.remove('is-open');
    chatWindow.setAttribute('aria-hidden', 'true');
    chatToggleBtn.classList.remove('is-open');
    chatToggleBtn.setAttribute('aria-expanded', 'false');
    chatToggleBtn.setAttribute('aria-label', 'チャットを開く');
  }

  chatToggleBtn.addEventListener('click', () => {
    if (chatWindow.classList.contains('is-open')) {
      closeChat();
    } else {
      openChat();
    }
  });

  chatCloseBtn?.addEventListener('click', closeChat);

  // Escキーで閉じる
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && chatWindow.classList.contains('is-open')) {
      closeChat();
    }
  });

  // ----- 吹き出し描画 -----
  function appendMessage(text, sender) {
    const msg = document.createElement('div');
    msg.className = `chat-msg chat-msg--${sender}`;
    msg.textContent = text;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return msg;
  }

  function showTypingIndicator() {
    const typing = document.createElement('div');
    typing.className = 'chat-msg chat-msg--bot chat-msg--typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typing;
  }

  // ----- ナレッジ読み込み（Google SheetsのCSVを取得してキャッシュ） -----
  let knowledgeRows = null;
  let knowledgeLoadPromise = null;

  function loadKnowledge() {
    if (knowledgeRows) return Promise.resolve(knowledgeRows);
    if (knowledgeLoadPromise) return knowledgeLoadPromise;

    // キャッシュ対策: 末尾にタイムスタンプを付けて、毎回必ず最新のCSVを取得する
    const cacheBustedUrl = `${SHEET_CSV_URL}&_ts=${Date.now()}`;

    knowledgeLoadPromise = fetch(cacheBustedUrl, { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status}`);
        return res.text();
      })
      .then((csvText) => {
        const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
        knowledgeRows = parsed.data;
        return knowledgeRows;
      })
      .catch((err) => {
        console.error('ナレッジ(Google Sheets)の読み込みに失敗しました:', err);
        knowledgeRows = []; // 失敗時は空配列にしておき、フォールバック文言で応答する
        return knowledgeRows;
      });

    return knowledgeLoadPromise;
  }

  // ----- システムプロンプト構築 -----
  // rows: [{category, question, answer, priority}, ...]
  // ナレッジの内容をそのままプロンプトに埋め込み、LLMに「このナレッジだけを根拠に
  // 答える」よう指示する（ハルシネーション対策の中心部分）。
  let cachedSystemPrompt = null;
  let cachedForRows = null;

  function buildSystemPrompt(rows) {
    if (cachedSystemPrompt && cachedForRows === rows) return cachedSystemPrompt;

    // priorityが小さいほど優先度が高い想定で並び替え（未設定は最後）
    const sorted = [...rows].sort((a, b) => {
      const pa = Number(a.priority);
      const pb = Number(b.priority);
      const na = Number.isFinite(pa) ? pa : Infinity;
      const nb = Number.isFinite(pb) ? pb : Infinity;
      return na - nb;
    });

    const knowledgeText = sorted
      .filter((row) => row.question && row.answer)
      .map((row, i) => {
        const category = row.category ? `[${row.category}] ` : '';
        return `${i + 1}. ${category}Q: ${row.question}\n   A: ${row.answer}`;
      })
      .join('\n');

    cachedSystemPrompt = [
      'あなたはスキンケアブランド「LUMEA SHIFT」の公式チャットボットです。',
      '以下の「ナレッジ」に書かれている内容だけを根拠にして、ユーザーの質問に答えてください。',
      '',
      '【ナレッジ】',
      knowledgeText || '（ナレッジが空です）',
      '',
      '【回答のルール】',
      '・ナレッジに書かれていない内容については、絶対に推測や一般論で答えないこと。',
      '・ナレッジで答えられない質問には「わかりかねます。お手数ですが担当者までお問い合わせください。」とだけ答えること。',
      '・**太字**や#見出しなどのMarkdown記法は一切使わず、プレーンテキストのみで、簡潔（2〜3文程度）に答えること。',
      '・丁寧で親しみやすい接客口調で答えること。',
    ].join('\n');
    cachedForRows = rows;

    return cachedSystemPrompt;
  }

  // ----- 回答ロジック（Railwayバックエンド経由でDeepSeek APIを呼び出す） -----
  async function getBotReply(userText) {
    const rows = await loadKnowledge();

    if (!rows || rows.length === 0) {
      return 'すみません、只今回答データの取得に失敗しました。時間をおいて再度お試しください。';
    }

    const systemPrompt = buildSystemPrompt(rows);

    try {
      const res = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userInput: userText, systemPrompt }),
      });

      if (!res.ok) {
        console.error('バックエンドAPIエラー:', res.status, await res.text());
        return 'すみません、只今回答の生成に失敗しました。時間をおいて再度お試しください。';
      }

      const data = await res.json();
      return data.answer || 'すみません、うまく回答を取得できませんでした。';
    } catch (err) {
      console.error('チャットAPI通信エラー:', err);
      return 'すみません、通信エラーが発生しました。ネットワーク環境をご確認のうえ、再度お試しください。';
    }
  }

  // ----- 送信処理 -----
  chatInputForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    chatInput.value = '';
    chatInput.disabled = true;
    if (chatSendBtn) chatSendBtn.disabled = true;

    const typingEl = showTypingIndicator();

    try {
      const reply = await getBotReply(text);
      typingEl.remove();
      appendMessage(reply, 'bot');
    } catch (err) {
      typingEl.remove();
      appendMessage('エラーが発生しました。時間をおいて再度お試しください。', 'bot');
      console.error('チャット応答エラー:', err);
    } finally {
      chatInput.disabled = false;
      if (chatSendBtn) chatSendBtn.disabled = false;
      chatInput.focus();
    }
  });
}