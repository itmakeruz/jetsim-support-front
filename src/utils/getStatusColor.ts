export const getStatusColor = (status: boolean) => {
  return status
    ? "text-red-600 bg-red-50 px-2 py-1 rounded"
    : "text-green-600 bg-green-50 px-2 py-1 rounded";
};
