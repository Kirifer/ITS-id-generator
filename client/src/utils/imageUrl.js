
export const getImageUrl = (path) => {
  if (!path) return '';
  
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  const serverBaseUrl = process.env.REACT_APP_SERVER_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
  
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${serverBaseUrl}${normalizedPath}`;
};


export const getServerBaseUrl = () => {
  return process.env.REACT_APP_SERVER_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
};