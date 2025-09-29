import { useState, useContext } from "react";
import { MyContext } from "../../App";

export default function CommentList({ comments, getComments, articleId }) {
    const { snackbar, setIsLoader, detoken, token } = useContext(MyContext);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingText, setEditingText] = useState("");

    const handleCommentAction = async (id, action) => {
        if (!token) return;
        setIsLoader(true);
        try {
            if (action === "DELETE") {
                if (!window.confirm("Are you sure you want to delete this comment?")) return;
                const res = await fetch(`http://127.0.0.1:8000/api/comments/${id}/`, { method: "DELETE", headers: { "Authorization": `Bearer ${token}` } });
                if (res.ok) { snackbar("Deleted successfully", "success"); getComments(articleId); }
                else snackbar("Failed to delete", "error");
            }
            if (action === "EDIT") {
                if (!editingText.trim()) { snackbar("Cannot be empty", "error"); return; }
                const res = await fetch(`http://127.0.0.1:8000/api/comments/${id}/`, {
                    method: "PATCH",
                    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
                    body: JSON.stringify({ text: editingText }),
                });
                if (res.ok) { snackbar("Updated successfully", "success"); setEditingCommentId(null); setEditingText(""); getComments(articleId); }
                else snackbar("Failed to update", "error");
            }
        } catch (err) { console.error(err); snackbar("Error occurred", "error"); }
        finally { setIsLoader(false); }
    };

    return comments.map(c => (
        <div key={c.id} className="commentItem">
            <strong>{c.user?.username}</strong>
            {editingCommentId === c.id ? (
                <div>
                    <textarea value={editingText} onChange={(e) => setEditingText(e.target.value)} className="form-control" rows={3} />
                    <button className="btn btn-success btn-sm mt-1" onClick={() => handleCommentAction(c.id, "EDIT")}>Save</button>
                    <button className="btn btn-secondary btn-sm mt-1 ms-2" onClick={() => setEditingCommentId(null)}>Cancel</button>
                </div>
            ) : <p>{c.text}</p>}
            {(token && (c.user?.id === detoken?.user_id || detoken?.isAdmin)) && (
                <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
                    {c.user?.id === detoken?.user_id && editingCommentId !== c.id && <i className="fas fa-edit" style={{ cursor: "pointer", color: "#007bff" }} onClick={() => { setEditingCommentId(c.id); setEditingText(c.text); }}></i>}
                    <i className="fas fa-trash" style={{ cursor: "pointer", color: "#dc3545" }} onClick={() => handleCommentAction(c.id, "DELETE")}></i>
                </div>
            )}
        </div>
    ));
}
