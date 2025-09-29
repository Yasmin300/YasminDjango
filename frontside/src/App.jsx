import { createContext, useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Register from './components/register';
import Nav from './components/navigation/nav';
import Cards from './components/Articles/Article';
import Router from './Router';
import Footer from './components/footer/footer'
export const MyContext = createContext();
import { jwtDecode } from 'jwt-decode';



function App() {
  const [isSnackbar, setIsSnackbar] = useState(false);
  const [snackbarText, setSnackbarText] = useState('');
  const [isLoader, setIsLoader] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [detoken, setDetoken] = useState(() => {
    const t = localStorage.getItem("token");
    if (!t) return null;
    try {
      const decoded = jwtDecode(t);
      return {
        user_id: decoded.user_id,
        username: decoded.username,
        email: decoded.email,
        isAdmin: decoded.is_admin,
      };
    } catch (err) {
      return null;
    }
  });
  const [search, setSearch] = useState(null);
  const [snackbarType, setSnackbarType] = useState("");
  const [articles, setArticles] = useState([]);
  const [loaderType, setLoaderType] = useState("");
  const [filters, setFilters] = useState({
    title: "",
    author__username: "",
    body: "",
    tags__name: ""
  });
  const [darkMode, setDarkMode] = useState(false); // ✅ Added dark mode state
  const [lastActivity, setLastActivity] = useState(Date.now());

  useEffect(() => {
    const updateActivity = () => setLastActivity(Date.now());

    window.addEventListener("mousemove", updateActivity);
    window.addEventListener("keydown", updateActivity);
    window.addEventListener("click", updateActivity);
    window.addEventListener("scroll", updateActivity);

    return () => {
      window.removeEventListener("mousemove", updateActivity);
      window.removeEventListener("keydown", updateActivity);
      window.removeEventListener("click", updateActivity);
      window.removeEventListener("scroll", updateActivity);
    };
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      document.body.classList.remove('dark');
      document.body.classList.add('light');
    }
  }, [darkMode]);

  const snackbar = (text, type = "") => {
    setSnackbarText(text);
    setSnackbarType(type);
    setIsSnackbar(true);
    setTimeout(() => setIsSnackbar(false), 3000);
  };

  const handleSearch = async () => {
    const res = await fetch(`http://127.0.0.1:8000/api/articles?search=${encodeURIComponent(search)}`, {
      method: 'GET',
    });
    if (res.ok) {
      const data = await res.json();
      setArticles(data);
    }
  };

  const handleFilterSearch = async () => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    console.log(params.toString());
    const res = await fetch(`http://127.0.0.1:8000/api/articles?${params.toString()}`, {
      method: 'GET',
    });
    console.log(res.ok);
    if (res.ok) {
      const data = await res.json();
      console.log(data);
      setArticles(data);
    }
  };
  const getArticles = async () => {
    setIsLoader(true);
    if (search && search !== "") {
      await handleSearch();
    } else if (filters && Object.values(filters).some(f => f)) {
      await handleFilterSearch();
    } else {
      const res = await fetch('http://127.0.0.1:8000/api/articles/');
      if (res.ok) setArticles(await res.json());
    }
    setIsLoader(false);
  };
  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh"); // get it from localStorage
      if (!refreshToken) return null;

      const res = await fetch("http://127.0.0.1:8000/api/token/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }) // send it in the body
      });

      if (!res.ok) throw new Error("Failed to refresh token");

      const data = await res.json();
      setToken(data.access); // update access token in state
      const decoded = jwtDecode(data.access);
      setDetoken({
        user_id: decoded.user_id,
        username: decoded.username,
        email: decoded.email,
        isAdmin: decoded.is_admin,
      });
      return data.access;

    } catch (err) {
      console.error("Token refresh failed:", err);
      setToken(null);
      setDetoken(null);
      return null;
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const minutesSinceActivity = (now - lastActivity) / 1000 / 60;

      // Only refresh if user was active in the last 5 minutes
      if (token && minutesSinceActivity < 5) {
        refreshAccessToken();
      }
      else if (minutesSinceActivity >= 10) {
        // User inactive for 30+ minutes, log out
        setToken(null);
        setDetoken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("refresh");
        snackbar("התנתקת עקב חוסר פעילות", "error");
      }
    }, 2 * 60 * 1000); // every 2 minutes

    return () => clearInterval(interval);
  }, [token, lastActivity]);

  return (
    <MyContext.Provider value={{
      snackbar, setIsLoader, setUser, user, darkMode,
      setDarkMode, search, setSearch, token, setToken, detoken, setDetoken,
      getArticles, setFilters, filters, articles, setArticles, handleFilterSearch, handleSearch,
    }}>
      <div className="page-container">
        <div className="content-wrap">
          <Nav />
          <Router />
          {isLoader && <div className="loaderFrame"><div className={`loader ${loaderType}`}></div></div>}
          {isSnackbar && <div className={`snackbar ${snackbarType}`}>{snackbarText}</div>}
        </div>
        <Footer />
      </div>
    </MyContext.Provider>
  );
}

export default App;
