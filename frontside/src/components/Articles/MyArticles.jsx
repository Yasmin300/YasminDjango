import { useState } from "react"
import { MyContext } from "../../App";
import { useContext } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Articles.css";
import '../Form/form.css';
import Pagination from "../pagination/Pagination";
export default function MyArticles() {
    const [articles, setArticles] = useState([]);
    const navigate = useNavigate();
    const { snackbar, setIsLoader, user, setSnackbarType, setLoaderType, search, token, detoken } = useContext(MyContext);
    const [currentPage, setCurrentPage] = useState(1);
    const ArticlesPerPage = 3;
    const [totalArticles, setTotalArticles] = useState(0);
    console.log("Token in MyArticles:", token)
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        getMyArticles(pageNumber);
    };
    const getMyArticles = async (page = 1) => {
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/articles/?page=${page}&page_size=${ArticlesPerPage}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (res.ok) {
                const data = await res.json();
                setArticles(data.results);
                setTotalArticles(data.count);
            }
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    useEffect(() => {
        if (token.isAdmin == false) navigate('/');
        getMyArticles();
    }, []);

    const handleEdit = (id) => {
        console.log("Edit card with id:", id);
        navigate(`/editArticle/${id}`);
    };
    const addCard = () => {
        navigate('/addArticle');
    }
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this card?")) return;
        setIsLoader(true);
        try {
            const res = await fetch(`http://127.0.0.1:8000/api/articles/${id}/`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                method: 'DELETE',
            });

            if (res.ok) {
                snackbar("Article deleted successfully", "success");
                await getMyArticles();
            } else {
                snackbar("Article delete failed", "error");
            }

        } catch (err) {
            console.error("Delete error:", err);
            snackbar("Error during deleting the article", "error");
        } finally {
            setIsLoader(false);
        }
    };

    return (
        <div className="Articles">
            <h1>My Articles Page</h1>
            <h2>Here you can find all your busincess Articles</h2>
            <hr />
            <div className="ArticlesContainer">
                {
                    articles.map((Articles, i) =>
                        <div key={Articles.id} id={Articles.id}>
                            <li className="ArticlesList">
                                <h3>{Articles.title}</h3>
                                <p>{Articles.body}</p>
                                <hr />
                                <span>Author:{Articles.author.username}</span>
                                <div>
                                    <strong>Tags:</strong>{" "}
                                    {Articles.tags_detail && Articles.tags_detail.length > 0 ? (
                                        Articles.tags_detail.map((tag, idx) => (
                                            <span key={idx} className="ArticleTag">
                                                {tag.name}
                                            </span>
                                        ))
                                    ) : (
                                        <span>No tags</span>
                                    )}
                                </div>

                                {detoken && (detoken?.isAdmin) && (
                                    <div style={{ display: 'flex', gap: '10px', marginLeft: '10px' }}>
                                        <i
                                            className="fas fa-edit"
                                            onClick={() => handleEdit(Articles.id)}
                                            style={{ cursor: 'pointer', color: '#007bff' }}
                                        ></i>

                                        <i
                                            className="fas fa-trash"
                                            onClick={() => handleDelete(Articles.id)}
                                            style={{ cursor: 'pointer', color: '#dc3545' }}
                                        ></i>
                                    </div>
                                )}
                            </li>
                        </div>
                    )
                }
            </div>
            {
                detoken && (detoken?.isAdmin) && (
                    <button className="plus-button" onClick={addCard}>
                        +
                    </button>
                )
            }
            <Pagination
                currentPage={currentPage}
                totalItems={totalArticles}   // ✅ from backend
                itemsPerPage={ArticlesPerPage}
                onPageChange={paginate}
            />

        </div >
    )
}
