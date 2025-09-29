import { useState, useEffect, useContext } from "react";
import { MyContext } from "../App";
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { jwtDecode } from 'jwt-decode';
import './Form/form.css';
import Joi from "joi";

export default function Login() {
    const [form, setForm] = useState({
        username: '',  // 👈 Django expects username, not email
        password: '',
    });
    const { snackbar, setIsLoader, setUser, setToken, setDetoken } = useContext(MyContext);
    const [isValid, setIsValid] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    function cleanForm() {
        setForm({ username: '', password: '' });
    }

    const schema = Joi.object({
        username: Joi.string().required().messages({
            "string.empty": "יש להזין שם משתמש",
        }),
        password: Joi.string().required().messages({
            "string.empty": "יש להזין סיסמה",
        }),
    });

    useEffect(() => {
        const { error } = schema.validate(form, { abortEarly: false });
        if (error) {
            const newErrors = {};
            error.details.forEach(err => {
                newErrors[err.path[0]] = err.message;
            });
            setErrors(newErrors);
            setIsValid(false);
        } else {
            setErrors({});
            setIsValid(true);
        }
    }, [form]);

    const login = async ev => {
        ev.preventDefault();
        if (!isValid) return;
        setIsLoader(true);

        try {
            const res = await fetch('http://127.0.0.1:8000/api/token/', {  // 👈 Django JWT endpoint
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const err = await res.json();
                snackbar(err.detail || "שגיאה בהתחברות", "error");
                setIsLoader(false);
                return;
            }

            const data = await res.json();
            // { refresh, access, user_id, username, email, is_admin }

            localStorage.setItem('token', data.access);
            localStorage.setItem('refresh', data.refresh);

            const decoded = jwtDecode(data.access);
            console.log("Raw server response:", data);
            console.log("Access token:", data.access);
            console.log("Refresh token:", data.refresh);
            console.log("Decoded token payload:", decoded);
            setDetoken({
                user_id: decoded.user_id,
                username: decoded.username,
                email: decoded.email,
                isAdmin: decoded.is_admin,
            });
            setToken(data.access);

            snackbar(`התחברת בהצלחה!`, "success");

            cleanForm();
            navigate('/');

        } catch (error) {
            snackbar('אירעה שגיאה בשרת, נסה שוב מאוחר יותר.', "error");
            console.error(error);
        }

        setIsLoader(false);
    };

    return (
        <form className="Form">
            <h2 className="mb-4 text-center">התחבר</h2>
            <div className="row">
                <div className="col-12">
                    <label className="form-label">
                        שם משתמש:
                        <input
                            type="text"
                            value={form.username}
                            className="form-control"
                            onChange={ev => setForm({ ...form, username: ev.target.value })}
                        />
                        {errors.username && <span>{errors.username}</span>}
                    </label>
                </div>
                <div className="col-12">
                    <label className="form-label">
                        סיסמה:
                        <input
                            type="password"
                            value={form.password}
                            className="form-control"
                            onChange={ev => setForm({ ...form, password: ev.target.value })}
                        />
                        {errors.password && <span>{errors.password}</span>}
                    </label>
                </div>
                <div className="col-12 text-center">
                    <button onClick={login} disabled={!isValid}>
                        התחבר
                    </button>
                </div>
            </div>
        </form>
    );
}
