import { useState } from "react"
import { MyContext } from "../../App";
import { useContext } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../pagination/Pagination";
import "./Articles.css";
import "./ArticlesHeader.css";
export default function GetArticles() {
    const [articles, setArticles] = useState([]);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const ArticlesPerPage = 3;
    const { snackbar, setIsLoader, setUser, user, search, setSearch, token, detoken, filters } = useContext(MyContext);
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        getMyArticles(pageNumber);
    };
    const getArticles = async (page = 1) => {
        setIsLoader(true);
        let url = `http://127.0.0.1:8000/api/articles/?page=${page}&page_size=${ArticlesPerPage}`;
        if (search && search.trim() !== "") {
            url += `&search=${encodeURIComponent(search.trim())}`;
        }
        if (filters && Object.values(filters).some(f => f)) {
            const appliedFilters = {};
            Object.entries(filters).forEach(([key, value]) => {
                if (value && value.trim() !== "") appliedFilters[key] = value.trim();
            });
            const params = new URLSearchParams(appliedFilters);
            url += `&${params.toString()}`;
        }

        const res = await fetch(url);
        if (res.ok) {
            const data = await res.json();
            setArticles(data.results);
            setTotalItems(data.count);
            setTotalPages(Math.ceil(data.count / ArticlesPerPage));
            setCurrentPage(page);
        }
        setIsLoader(false);
    };


    const handleClick = (id) => {
        navigate(`/explainArticles/${id}`);
    }
    useEffect(() => {
        getArticles(1);
    }, [search, filters]);

    useEffect(() => {
        if (search !== null && search !== "") {
            setCurrentPage(1);
        }
    }, [search]);

    return (
        <div className="Articles">
            <div className="ArticlesHeader">
                <h1>Welcome to the Articles Hub</h1>
                <p>Discover professional business Articles from all industries, all in one place.</p>
                <hr />
            </div>
            <hr />
            <div className="ArticlesContainer">
                {
                    articles.map((Articles, i) =>
                        <div key={Articles.id} id={Articles.id} onClick={() => { handleClick(Articles.id) }}>
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
                            </li>
                        </div>
                    )
                }
            </div>
            <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={3}   // should match PAGE_SIZE in DRF
                onPageChange={(page) => {
                    setCurrentPage(page);
                    getArticles(page);
                }}
            />
        </div >
    )
}
