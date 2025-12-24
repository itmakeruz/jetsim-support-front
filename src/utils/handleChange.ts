// path bo‘yicha obyekt ichini yangilovchi yordamchi funksiya
const setDeepValue = (obj: any, path: string, value: any) => {
  if (!obj || typeof obj !== "object") {
    return;
  }
  const keys = path.split(".");
  const lastKey = keys.pop()!;
  const lastObj = keys.reduce((acc, key) => {
    if (!acc[key] || typeof acc[key] !== "object") {
      acc[key] = {};
    }
    return acc[key];
  }, obj);
  lastObj[lastKey] = value;
};

export const handleChange =
  <T extends object>(
    setState: React.Dispatch<React.SetStateAction<T>>,
    setPreviewImage?: React.Dispatch<React.SetStateAction<string | null>>
  ) =>
  (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const target = e.target as HTMLInputElement;
    if (!target || !target.name) return;
    const { name, type, value, checked, files } = target;
    const finalValue = type === "checkbox" ? checked : value;

    // File input
    if (type === "file") {
      const file = files?.[0];
      if (file) {
        setState((prev: any) => {
          const copy = prev ? structuredClone(prev) : {};
          setDeepValue(copy, name, file);
          return copy;
        });

        const reader = new FileReader();
        reader.onload = (ev) => {
          setPreviewImage?.(ev.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
      return;
    }

    // Text/select/textarea
    setState((prev: any) => {
      const copy = prev ? structuredClone(prev) : {};
      setDeepValue(copy, name, finalValue);
      return copy;
    });
  };
