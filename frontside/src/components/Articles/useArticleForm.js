import { useState, useEffect } from "react";
import Joi from "joi";

const defaultForm = {
    title: "",
    body: "",
    tags: "",
};

const schema = Joi.object({
    title: Joi.string().min(2).max(500).required().messages({
        "string.empty": "יש להזין כותרת",
        "string.min": "כותרת חייבת להכיל לפחות 2 תווים",
    }),
    body: Joi.string().min(10).max(5000).required().messages({
        "string.empty": "יש להזין תוכן",
        "string.min": "תוכן חייב להכיל לפחות 10 תווים",
    }),
    tags: Joi.string().allow("").messages({
        "string.base": "תגיות חייבות להיות טקסט מופרד בפסיקים",
    }),
});

export function useArticleForm(initial = defaultForm) {
    const [form, setForm] = useState(initial);
    const [errors, setErrors] = useState({});
    const [isValid, setIsValid] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => setForm(defaultForm);

    useEffect(() => {
        const { error } = schema.validate(form, { abortEarly: false });
        if (error) {
            const newErrors = {};
            error.details.forEach(e => {
                newErrors[e.path[0]] = e.message;
            });
            setErrors(newErrors);
            setIsValid(false);
        } else {
            setErrors({});
            setIsValid(true);
        }
    }, [form]);

    return { form, setForm, handleChange, resetForm, isValid, errors };
}
