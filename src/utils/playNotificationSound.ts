import { notificationSound } from "@/assets/sounds";

let audioInstance: HTMLAudioElement | null = null;
let isInitialized = false;

// Audio elementini initialize qilish (user interaction bilan)
export const initializeNotificationSound = () => {
  if (isInitialized && audioInstance) {
    return;
  }

  try {
    audioInstance = new Audio(notificationSound);
    audioInstance.volume = 0.5;
    audioInstance.preload = "auto";

    // Bir marta play/pause qilish orqali brauzer xavfsizlik siyosatini o'tkazish
    const playPromise = audioInstance.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          audioInstance?.pause();
          audioInstance!.currentTime = 0;
          isInitialized = true;
        })
        .catch(() => {
          // Agar xatolik bo'lsa, keyinroq qayta urinib ko'ramiz
          isInitialized = false;
        });
    }
  } catch (error) {
    console.error("Ovoz initialize qilishda xatolik:", error);
    isInitialized = false;
  }
};

export const playNotificationSound = () => {
  try {
    // Agar initialize qilinmagan bo'lsa, audio'ni o'ynatish mumkin emas
    if (!isInitialized || !audioInstance) {
      // Silent fail - user interaction bo'lmaganda ovoz chiqmaydi
      return;
    }

    // Audio elementini qayta o'rnatish
    audioInstance.currentTime = 0;

    // Ovozni ijro etish
    const playPromise = audioInstance.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        // Agar xatolik bo'lsa, faqat console'ga yozamiz
        if (error.name !== "NotAllowedError") {
          console.error("Ovoz ijro etishda xatolik:", error);
        }
      });
    }
  } catch (error) {
    console.error("Ovoz chiqarishda xatolik:", error);
  }
};
