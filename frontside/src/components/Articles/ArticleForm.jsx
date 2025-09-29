import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MyContext } from "../../App";
import { useArticleForm } from "./useArticleForm";
import ArticleFormFields from "../Form/ArticleFormFields";

export default function ArticleForm() {
    const { articleId } = useParams();
    const { snackbar, setIsLoader, token } = useContext(MyContext);
    const navigate = useNavigate();

    const { form, setForm, handleChange, resetForm, isValid, errors } = useArticleForm();
    const isEdit = !!articleId;

    const fetchArticle = async () => {
        setIsLoader(true);
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/articles/${articleId}`);
            if (!res.ok) throw new Error("כשל בטעינת מאמר");
            const article = await res.json();
            setForm({
                title: article.title || "",
                body: article.body || "",
                tags: article.tags ? article.tags.map(t => t.name).join(", ") : "",
            });
        } catch (err) {
            snackbar("שגיאה בטעינת המאמר", "error");
        } finally {
            setIsLoader(false);
        }
    };

    useEffect(() => {
        if (isEdit) fetchArticle();
    }, [articleId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValid) return;

        const method = isEdit ? "PUT" : "POST";
        const url = isEdit
            ? `http://127.0.0.1:8000/api/articles/${articleId}/`
            : `http://127.0.0.1:8000/api/articles/`;

        // Backend will set author + created_at
        const requestBody = {
            title: form.title,
            body: form.body,
            tags: form.tags.split(",").map(t => t.trim()), // convert comma string → list
        };

        setIsLoader(true);
        const res = await fetch(url, {
            method,
            headers: {
                "Authorization": `Bearer ${token}`, // ✅ JWT expected
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestBody)
        });

        setIsLoader(false);
        if (res.ok) {
            snackbar(isEdit ? "המאמר עודכן" : "מאמר חדש נוסף", "success");
            resetForm();
            navigate("/MyArticles");
        } else {
            const err = await res.text();
            snackbar(`שליחה נכשלה: ${err || "שגיאה לא ידועה"}`, "error");
        }
    };

    return (
        <div className="ContainForm">
            <form onSubmit={handleSubmit} className="Form row">
                <h2 className="text-center mb-4">{isEdit ? "ערוך מאמר" : "הוסף מאמר"}</h2>
                <ArticleFormFields form={form} handleChange={handleChange} errors={errors} />
                <div className="col-12 text-center">
                    <button type="submit" className="btn btn-primary" disabled={!isValid}>שלח</button>
                </div>
                <div className="col-6 text-center">
                    <button type="button" className="btn btn-secondary" onClick={() => navigate("/articles")}>ביטול</button>
                </div>
                <div className="col-6 text-center">
                    <button type="button" className="btn btn-warning" onClick={resetForm}>
                        <i className="fas fa-recycle me-2"></i> איפוס
                    </button>
                </div>
            </form>
        </div>
    );
}
