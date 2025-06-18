// Template Method cho các thao tác lịch hẹn
export const useAppointmentTemplate = () => {
  // Bước 1: Validate dữ liệu (có thể override)
  const validate = (data) => true;

  // Bước 2: Gọi API (bắt buộc override)
  const apiCall = async (data) => {
    throw new Error("apiCall must be implemented");
  };

  // Bước 3: Xử lý kết quả/thông báo (có thể override)
  const handleResult = (result) => {};

  // Template method
  const process = async (
    data,
    { validateOverride, apiCallOverride, handleResultOverride } = {}
  ) => {
    const isValid = (validateOverride || validate)(data);
    if (!isValid) return;

    try {
      const result = await (apiCallOverride || apiCall)(data);
      (handleResultOverride || handleResult)(result);
      return result;
    } catch (error) {
      throw error;
    }
  };

  return { process };
}; 