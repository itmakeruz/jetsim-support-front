// Web Notifications API yordamida bildirishnoma chiqarish

let permissionGranted = false;
const activeNotifications = new Map<string, Notification>(); // Faol bildirishnomalar

// Bildirishnoma ruxsatini so'rash
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!("Notification" in window)) {
    console.log("Bu brauzer bildirishnomalarni qo'llab-quvvatlamaydi");
    return false;
  }

  console.log("Hozirgi bildirishnoma ruxsati:", Notification.permission);

  if (Notification.permission === "granted") {
    permissionGranted = true;
    console.log("Bildirishnoma ruxsati allaqachon berilgan");
    return true;
  }

  if (Notification.permission === "denied") {
    console.log("Bildirishnoma ruxsati rad etilgan. Brauzer sozlamalaridan ruxsat bering.");
    return false;
  }

  // permission === "default"
  try {
    console.log("Bildirishnoma ruxsati so'ralmoqda...");
    const permission = await Notification.requestPermission();
    permissionGranted = permission === "granted";
    console.log("Bildirishnoma ruxsati javobi:", permission);
    return permissionGranted;
  } catch (error) {
    console.error("Bildirishnoma ruxsati so'rashda xatolik:", error);
    return false;
  }
};

// Bildirishnoma chiqarish
export const showNotification = (
  title: string,
  options?: NotificationOptions
) => {
  if (!("Notification" in window)) {
    console.log("Bu brauzer bildirishnomalarni qo'llab-quvvatlamaydi");
    return;
  }

  console.log("Bildirishnoma ruxsati:", Notification.permission);

  if (Notification.permission === "granted") {
    try {
      const tag = options?.tag || `notification-${Date.now()}`;
      
      // Agar bir xil tag bilan bildirishnoma mavjud bo'lsa, uni yopamiz
      if (activeNotifications.has(tag)) {
        const oldNotification = activeNotifications.get(tag);
        if (oldNotification) {
          oldNotification.close();
          activeNotifications.delete(tag);
        }
      }
      
      const notification = new Notification(title, {
        icon: "/logoIcon.png", // Notification icon
        badge: "/logoIcon.png",
        tag: tag,
        ...options,
      });
      
      // Faol bildirishnomalar ro'yxatiga qo'shamiz
      activeNotifications.set(tag, notification);
      
      console.log("Bildirishnoma chiqarildi:", title, "tag:", tag);
      
      // Bildirishnoma yopilganda
      notification.onclick = () => {
        window.focus();
        notification.close();
        activeNotifications.delete(tag);
      };
      
      // Bildirishnoma yopilganda (avtomatik yoki foydalanuvchi tomonidan)
      notification.onclose = () => {
        activeNotifications.delete(tag);
      };
      
      // 5 soniyadan keyin avtomatik yopish (agar kerak bo'lsa)
      setTimeout(() => {
        if (activeNotifications.has(tag)) {
          notification.close();
          activeNotifications.delete(tag);
        }
      }, 5000);
    } catch (error) {
      console.error("Bildirishnoma chiqarishda xatolik:", error);
    }
  } else if (Notification.permission === "default") {
    // Ruxsat so'rash
    console.log("Bildirishnoma ruxsati so'ralmoqda...");
    requestNotificationPermission().then((granted) => {
      if (granted) {
        console.log("Ruxsat berildi, bildirishnoma chiqarilmoqda...");
        showNotification(title, options);
      } else {
        console.log("Ruxsat rad etildi");
      }
    });
  } else {
    console.log("Bildirishnoma ruxsati rad etilgan");
  }
};

// Bildirishnoma ruxsatini tekshirish
export const checkNotificationPermission = (): boolean => {
  if (!("Notification" in window)) {
    return false;
  }
  return Notification.permission === "granted";
};
