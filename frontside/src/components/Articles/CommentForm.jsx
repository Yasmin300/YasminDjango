import { useState, useContext } from "react";
import { MyContext } from "../../App";

export default function CommentForm({ getComments, articleId }) {
    const { snackbar, setIsLoader, token } = useContext(MyContext);
    const [form, setForm] = useState({ text: "" });
    const [error, setError] = useState("");

    const handleChange = e => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        if (value.length < 2) setError("Comment must be at least 2 characters long.");
        else if (value.length > 200) setError("Comment cannot exceed 200 characters.");
        else setError("");
    };

    const addComment = async e => {
        e.preventDefault();
        if (!error && form.text.trim().length >= 2) {
            setIsLoader(true);
            try {
                const res = await fetch(`http://127.0.0.1:8000/api/articles/${articleId}/comments/`, { method: "POST", headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(form) });
                if (!res.ok) { snackbar("Cannot add comment", "error"); return; }
                setForm({ text: "" });
                getComments(articleId);
            } catch (err) { console.error(err); snackbar("Error adding comment", "error"); }
            finally { setIsLoader(false); }
        }
    };

    if (!token) return null;
    return (
        <div className="AddComment mt-3">
            <form className="Form addcomment" onSubmit={addComment}>
                <textarea name="text" value={form.text || ""} onChange={handleChange} className="form-control" rows={4} required minLength={2} maxLength={200} placeholder="Write your comment..." />
                {error && <small className="text-danger">{error}</small>}
                <div className="mt-2 text-center">
                    <button type="submit" className="btn btn-primary">Send</button>
                </div>
            </form>
        </div>
    );
}
