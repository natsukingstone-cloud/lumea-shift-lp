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
