import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("cp_token");
    const savedUser = localStorage.getItem("cp_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  async function loginWithEmail(email, password) {
    const res = await axios.post("http://127.0.0.1:5000/api/login", { email, password });
    saveSession(res.data.token, res.data.user);
    return res.data;
  }

  async function registerWithEmail(name, email, password) {
    const res = await axios.post("http://127.0.0.1:5000/api/register", { name, email, password });
    saveSession(res.data.token, res.data.user);
    return res.data;
  }

  async function loginWithGoogle(googleUser) {
    const res = await axios.post("http://127.0.0.1:5000/api/google-auth", {
      name: googleUser.name,
      email: googleUser.email,
      google_id: googleUser.sub,
    });
    saveSession(res.data.token, res.data.user);
    return res.data;
  }

  function saveSession(tok, usr) {
    setToken(tok);
    setUser(usr);
    localStorage.setItem("cp_token", tok);
    localStorage.setItem("cp_user", JSON.stringify(usr));
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem("cp_token");
    localStorage.removeItem("cp_user");
  }

  function getAuthHeader() {
    return token ? { Authorization: "Bearer " + token } : {};
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, loginWithEmail, registerWithEmail, loginWithGoogle, logout, getAuthHeader }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}