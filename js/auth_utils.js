const auth = (() => {
  const TOKEN_KEY = "token";

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  }

  async function fetchProfile() {
    const token = getToken();
    if (!token) return null;
    try {
      const res = await fetch("https://food-delivery.int.kreosoft.space/api/account/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      return await res.json();
    } catch {
      clearToken();
      return null;
    }
  }

  async function logout() {
    const token = getToken();
    if (!token) return;
    try {
      await fetch("https://food-delivery.int.kreosoft.space/api/account/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch {
      // ignore errors on logout
    }
    clearToken();
  }

  return {
    getToken,
    setToken,
    clearToken,
    fetchProfile,
    logout
  };
})();
