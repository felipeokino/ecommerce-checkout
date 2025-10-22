'use client';
export const useUser = () => {
  const getUser = () => {
    const userData = typeof window !== 'undefined' ? localStorage.getItem('user:data') : null;
    if (userData) {
      return JSON.parse(userData);
    }
    return null;
  }
  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user:data');
    }
  }
  return { getUser, logout };
}