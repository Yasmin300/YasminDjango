import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MyContext } from "../../App";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";
import "./ShowArticle.css";

export default function ShowArticle() {
    const { articleId } = useParams();
    const [article, setArticle] = useState({});
    const [comments, setComments] = useState([]);
    const { snackbar, setIsLoader, token } = useContext(MyContext);

    const getArticle = async (id) => {
        setIsLoader(true);
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/articles/${id}`);
            if (!res.ok) return snackbar("Cannot load article", "error");
            const articleData = await res.json();
            setArticle(articleData);
            getComments(id);
        } catch (err) { console.error(err); snackbar("Error loading article", "error"); }
        finally { setIsLoader(false); }
    };

    const getComments = async (id) => {
        setIsLoader(true);
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/articles/${id}/comments`);
            if (!res.ok) return snackbar("Cannot load comments", "error");
            const data = await res.json();
            setComments(Array.isArray(data) ? data : data.results || []);
        } catch (err) { console.error(err); snackbar("Error loading comments", "error"); }
        finally { setIsLoader(false); }
    };

    useEffect(() => { if (articleId) getArticle(articleId); }, [articleId]);

    return (
        <div className="ArticlesPage">
            <h1 className="ArticlesTitle">{article.title}</h1>
            <div className="ArticlesContent">
                <div className="ArticlesDetails">
                    <p>{article.body}</p>
                    <hr />
                    <span>Author: {article.author?.username}</span>
                    <div>
                        <strong>Tags:</strong>{" "}
                        {article.tags_detail?.length > 0 ? article.tags_detail.map((t, i) => <span key={i} className="ArticleTag">{t.name}</span>) : "No tags"}
                    </div>
                    <hr />
                    <h4>Comments</h4>
                    <CommentList comments={comments} getComments={getComments} articleId={articleId} />
                    <CommentForm getComments={getComments} articleId={articleId} />
                </div>
            </div>
        </div>
    );
}
