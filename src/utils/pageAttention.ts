// Xabar kelganda oynani fokus qilish va title'ni o'zgartirish

let originalTitle = document.title;
let attentionInterval: number | null = null;
let blinkCount = 0;
const MAX_BLINK_COUNT = 10; // 10 marta yonib-o'chadi

// Oynani fokus qilish va title'ni o'zgartirish
export const requestPageAttention = (message: string = "Yangi xabar") => {
  // Original title'ni saqlash (bir marta)
  if (!originalTitle) {
    originalTitle = document.title;
  }

  // Oynani fokus qilishga harakat qilish
  if (document.hidden) {
    // Agar oyna yashirin bo'lsa, fokus qilishga harakat qilamiz
    window.focus();
  }

  // Title'ni yangilash
  document.title = `🔔 ${message} - ${originalTitle}`;

  // Blink effect (title'da yonib-o'chadi)
  blinkCount = 0;
  if (attentionInterval) {
    clearInterval(attentionInterval);
  }

  attentionInterval = window.setInterval(() => {
    if (blinkCount >= MAX_BLINK_COUNT) {
      // Blink tugagach, oddiy title'ga qaytamiz
      document.title = originalTitle;
      if (attentionInterval) {
        clearInterval(attentionInterval);
        attentionInterval = null;
      }
      return;
    }

    // Blink effect
    if (blinkCount % 2 === 0) {
      document.title = `🔔 ${message} - ${originalTitle}`;
    } else {
      document.title = originalTitle;
    }
    blinkCount++;
  }, 1000); // Har 1 soniyada

  // Oynaga qaytish event listener
  const handleVisibilityChange = () => {
    if (!document.hidden) {
      // Oyna ko'rinadigan bo'lganda, title'ni tozalash
      document.title = originalTitle;
      if (attentionInterval) {
        clearInterval(attentionInterval);
        attentionInterval = null;
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleVisibilityChange);
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("focus", handleVisibilityChange);
};

// Title'ni tozalash
export const clearPageAttention = () => {
  if (attentionInterval) {
    clearInterval(attentionInterval);
    attentionInterval = null;
  }
  document.title = originalTitle;
};
