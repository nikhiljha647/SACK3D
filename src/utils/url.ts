// Utility to construct full URLs for uploaded files
export const getFileUrl = (path: string): string => {
  if (!path) return ''
  
  // If path already includes the domain, return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  
  // Otherwise, prepend the API base URL
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000'
  return `${apiUrl}${path}`
}
