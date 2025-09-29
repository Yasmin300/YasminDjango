import { useState, useEffect, useContext } from "react";
import { MyContext } from "../App";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import Joi from "joi";
import './Form/form.css';
import UserFormFields from './Form/FormFieldUser';

export default function Register() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        phone: "",
        firstName: "",
        middleName: "",
        lastName: "",
        country: "",
        city: "",
        street: "",
        houseNumber: ""
    });

    const [isValid, setIsValid] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { snackbar, setIsLoader } = useContext(MyContext);

    const register = async ev => {
        ev.preventDefault();
        if (!isValid) return;
        setIsLoader(true);

        // match Django field names (snake_case)
        const requestBody = {
            username: form.username,
            email: form.email,
            password: form.password,
            phone: form.phone,
            first_name: form.firstName,
            middle_name: form.middleName || null,
            last_name: form.lastName,
            country: form.country,
            city: form.city,
            street: form.street,
            house_number: form.houseNumber
        };

        const res = await fetch("http://127.0.0.1:8000/api/register/", {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(requestBody),
        });

        if (res.ok) {
            setIsLoader(false);
            cleanForm();
            snackbar("נרשמת בהצלחה", "success");
            navigate("/login");
        } else {
            setIsLoader(false);
            const err = await res.text();
            snackbar(`הרשמה נכשלה: ${err}`, "error");
        }
    };

    function cleanForm() {
        setForm({
            username: "",
            email: "",
            password: "",
            phone: "",
            firstName: "",
            middleName: "",
            lastName: "",
            country: "",
            city: "",
            street: "",
            houseNumber: ""
        });
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // ✅ Joi schema now matches Django model
    const schema = Joi.object({
        username: Joi.string().min(3).max(50).required().messages({
            "string.empty": "יש להזין שם משתמש",
            "string.min": "שם משתמש חייב להכיל לפחות 3 תווים",
        }),
        email: Joi.string().email({ tlds: { allow: false } }).required().messages({
            "string.empty": "יש להזין אימייל",
            "string.email": "אימייל לא תקין",
        }),
        password: Joi.string()
            .min(6)
            .required()
            .messages({
                "string.empty": "יש להזין סיסמה",
                "string.min": "סיסמה חייבת להיות לפחות 6 תווים",
            }),
        phone: Joi.string()
            .pattern(/^\+?\d{9,15}$/)
            .allow("")
            .messages({
                "string.pattern.base": "מספר טלפון לא תקין",
            }),
        firstName: Joi.string().min(2).max(30).required().messages({
            "string.empty": "יש להזין שם פרטי",
        }),
        middleName: Joi.string().max(30).allow(""),
        lastName: Joi.string().min(2).max(30).required().messages({
            "string.empty": "יש להזין שם משפחה",
        }),
        country: Joi.string().min(2).max(50).required().messages({
            "string.empty": "יש להזין מדינה",
        }),
        city: Joi.string().min(2).max(50).required().messages({
            "string.empty": "יש להזין עיר",
        }),
        street: Joi.string().min(2).max(100).required().messages({
            "string.empty": "יש להזין רחוב",
        }),
        houseNumber: Joi.string().min(1).max(10).required().messages({
            "string.empty": "יש להזין מספר בית",
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

    return (
        <div className="ContainForm">
            <form className="Form" onSubmit={register}>
                <h2 className="mb-4 text-center">טופס הרשמה</h2>
                <div className="row">
                    <UserFormFields
                        form={form}
                        errors={errors}
                        handleChange={handleChange}
                        includeEmailAndPassword={true}
                    />
                    <div className="col-12 text-center">
                        <button type="submit" className="btn btn-primary" disabled={!isValid}>שלח</button>
                    </div>
                    <div className="col-6 text-center">
                        <button type="button" className="btn btn-primary" onClick={() => { cleanForm(); navigate("/") }}>Cancel</button>
                    </div>
                    <div className="col-6 text-center">
                        <button type="button" className="btn btn-primary" onClick={cleanForm}>
                            <i className="fas fa-recycle me-2"></i>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
