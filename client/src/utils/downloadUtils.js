import { axiosInstance } from "../api/axiosConfig";

export const downloadImage = async (s3Key, filename) => {
  try {
    console.log("🔽 Starting download for:", s3Key);

    const downloadUrl = `/images/download?key=${encodeURIComponent(s3Key)}`;


    const response = await axiosInstance.get(downloadUrl, {
      responseType: "blob",
    });


    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    console.log("💾 Download completed");
    return true;
  } catch (error) {
    console.error("❌ Download failed:", error);
    throw error;
  }
};