// Helper function to check token expiration
export const isTokenExpired = (token) => {
  try {
    const decoded = JSON.parse(atob(token.split('.')[1])); // Decode JWT to get expiration
    const expiration = decoded.exp * 1000; // Convert to milliseconds
    return Date.now() > expiration; // Check if the token is expired
  } catch (error) {
    return true; // Return true if the token is invalid
  }
};

export function setCookie(name, value, days) {
  try {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/;Max-Age=604800; SameSite=Strict";
    return true
  } catch (error) {
    return false

  }
}

export function getCookie(name) {
  try {
    const cookies = document.cookie.split("; ");

    for (let cookie of cookies) {
      const [key, value] = cookie.split("=");
      if (key === name) return decodeURIComponent(value);
    }
    return null;

  } catch (error) {
    return null;
  }
};


