import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("mindflow_token");
    const savedUser = localStorage.getItem("mindflow_user");
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post(`${API}/auth/login`, { email, password });
    localStorage.setItem("mindflow_token", data.token);
    localStorage.setItem("mindflow_user", JSON.stringify(data.user));
    axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await axios.post(`${API}/auth/register`, { name, email, password });
    localStorage.setItem("mindflow_token", data.token);
    localStorage.setItem("mindflow_user", JSON.stringify(data.user));
    axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("mindflow_token");
    localStorage.removeItem("mindflow_user");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
