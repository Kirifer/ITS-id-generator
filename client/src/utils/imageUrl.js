const urlCache = new Map();

export const getImageUrl = async (s3Key) => {
  if (!s3Key) {
    return "";
  }

  // if (s3Key.startsWith("http://") || s3Key.startsWith("https://")) {
  //   return s3Key;
  // }

  const cached = urlCache.get(s3Key);
  if (cached && Date.now() - cached.timestamp < 55 * 60 * 1000) {
    return cached.url;
  }

  try {
    console.log("Fetching image URL for S3 key:", s3Key);
    const serverBaseUrl =
      process.env.REACT_APP_SERVER_BASE_URL || "http://localhost:5000/api";
    const fullUrl = `${serverBaseUrl}/images/url?key=${encodeURIComponent(s3Key)}`;

    console.log("Full URL for fetching image:", fullUrl);

    const response = await fetch(fullUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch image URL: ${response.status}`);
    }

    const data = await response.json();

    urlCache.set(s3Key, {
      url: data.url,
      timestamp: Date.now(),
    });

    return data.url;
  } catch (error) {
    return "";
  }
};

export const getServerBaseUrl = () => {
  return (
    process.env.REACT_APP_SERVER_BASE_URL?.replace("/api", "") ||
    "http://localhost:5000"
  );
};
