
export const getToken = (): string | null => {
    return localStorage.getItem('token'); // Assuming token is stored in local storage
  };
  
  export const setToken = (token: string): void => {
    localStorage.setItem('token', token); // Store token
  };
  
  export const removeToken = (): void => {
    localStorage.removeItem('token'); // Remove token
  };
  