import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Journal from "./pages/Journal";
import Insights from "./pages/Insights";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import ToastContainer from "./components/Toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./index.css";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const AppLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<PrivateRoute><AppLayout><Dashboard /></AppLayout></PrivateRoute>} />
            <Route path="/journal" element={<PrivateRoute><AppLayout><Journal /></AppLayout></PrivateRoute>} />
            <Route path="/insights" element={<PrivateRoute><AppLayout><Insights /></AppLayout></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><AppLayout><Profile /></AppLayout></PrivateRoute>} />
          </Routes>
          <ToastContainer />
        </div>
      </Router>
    </AuthProvider>
  );
}
