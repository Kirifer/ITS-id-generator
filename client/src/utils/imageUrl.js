let urlCache = new Map();

export const getImageUrl = async (s3Key) => {
  if (!s3Key) {
    return "";
  }

  let key = s3Key;
  if (s3Key.startsWith("http://") || s3Key.startsWith("https://")) {
    try {
      const url = new URL(s3Key);
      key = url.pathname.substring(1);
    } catch (error) {
      console.error("Failed to parse S3 URL:", error);
      return "";
    }
  }


  const cached = urlCache.get(key);
  if (cached && Date.now() - cached.timestamp < 55 * 60 * 1000) {
    return cached.url;
  }

  try {
    const serverBaseUrl =
      process.env.REACT_APP_SERVER_BASE_URL || "http://localhost:5000/api";
    const fullUrl = `${serverBaseUrl}/images/url?key=${encodeURIComponent(key)}`;

    const response = await fetch(fullUrl, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      console.error(`Failed to fetch presigned URL: ${response.status}`);
      return "";
    }

    const data = await response.json();

    urlCache.set(key, {
      url: data.url,
      timestamp: Date.now(),
    });

    return data.url;
  } catch (error) {
    console.error("Error getting image URL:", error);
    return "";
  }
};

export const getServerBaseUrl = () => {
  return (
    process.env.REACT_APP_SERVER_BASE_URL?.replace("/api", "") ||
    "http://localhost:5000"
  );
};