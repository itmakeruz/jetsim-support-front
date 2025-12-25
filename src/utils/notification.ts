// Web Notifications API yordamida bildirishnoma chiqarish

let permissionGranted = false;

// Bildirishnoma ruxsatini so'rash
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!("Notification" in window)) {
    console.log("Bu brauzer bildirishnomalarni qo'llab-quvvatlamaydi");
    return false;
  }

  if (Notification.permission === "granted") {
    permissionGranted = true;
    return true;
  }

  if (Notification.permission !== "denied") {
    try {
      const permission = await Notification.requestPermission();
      permissionGranted = permission === "granted";
      return permissionGranted;
    } catch (error) {
      console.error("Bildirishnoma ruxsati so'rashda xatolik:", error);
      return false;
    }
  }

  return false;
};

// Bildirishnoma chiqarish
export const showNotification = (
  title: string,
  options?: NotificationOptions
) => {
  if (!("Notification" in window)) {
    return;
  }

  if (Notification.permission === "granted") {
    try {
      new Notification(title, {
        icon: "/logoIcon.png", // Notification icon
        badge: "/logoIcon.png",
        ...options,
      });
    } catch (error) {
      console.error("Bildirishnoma chiqarishda xatolik:", error);
    }
  } else if (Notification.permission !== "denied") {
    // Ruxsat so'rash
    requestNotificationPermission().then((granted) => {
      if (granted) {
        showNotification(title, options);
      }
    });
  }
};

// Bildirishnoma ruxsatini tekshirish
export const checkNotificationPermission = (): boolean => {
  if (!("Notification" in window)) {
    return false;
  }
  return Notification.permission === "granted";
};
