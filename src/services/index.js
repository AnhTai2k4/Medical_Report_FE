import axios from "axios";

const incidentObjectCounts = async () => {
  try {
    const result = await axios.get(
      `${import.meta.env.VITE_BE_URL}/form/incidentObjectCounts`
    );

    return result.data.data; // Trả về data từ backend
  } catch (error) {
    console.log("Lỗi khi gọi API:", error);
    return null; // hoặc throw error nếu muốn
  }
};

const incidentDateCounts = async () => {
  try {
    const result = await axios.get(
      `${import.meta.env.VITE_BE_URL}/form/incidentDateCounts`
    );

    return result.data.data; // Trả về data từ backend
  } catch (error) {
    console.log("Lỗi khi gọi API:", error);
    return null; // hoặc throw error nếu muốn
  }
};

const locationDataCounts = async () => {
  try {
    const result = await axios.get(
      `${import.meta.env.VITE_BE_URL}/form/locationCounts`
    );

    const datas = result.data.data;

    datas.map((data) => {
      if (data.value === "") {
        data.value = "Khác";
      }
    });

    return datas;
  } catch (error) {
    console.log("Lỗi khi gọi API:", error);
    return null; // hoặc throw error nếu muốn
  }
};
export { incidentObjectCounts, incidentDateCounts, locationDataCounts };
