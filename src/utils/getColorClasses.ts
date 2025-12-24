type ColorKeyword = "new" | "pendingCancel" | "cancelled" | "active";

const getColorClasses = (keyWord: ColorKeyword): string => {
  switch (keyWord) {
    case "new":
      return "text-main-orange border border-main-orange";
    case "pendingCancel":
      return "text-[#1D1D1D] border border-[#1D1D1D]";
    case "cancelled":
      return "text-[#F01E1E] border border-[#F01E1E]";
    case "active":
      return "text-[#1A883B] border border-[#1A883B]";
    default:
      return "text-white border border-main-orange";
  }
};

export default getColorClasses;
