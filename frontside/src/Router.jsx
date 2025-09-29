import { Routes, Route } from 'react-router-dom';
import Register from './components/register';
import Login from './components/Login';
import Articles from './components/Articles/Article';
import MyArticles from './components/Articles/MyArticles';
import ExplainArticle from './components/Articles/explainArticles';
import ArticleForm from './components/Articles/ArticleForm';


export default function Router() {
    return (
        <Routes>
            <Route path="/" element={<Articles />} />
            <Route path="/MyArticles" element={<MyArticles />} />
            <Route path="/AddArticle" element={<ArticleForm />} />
            <Route path="/register" element={<Register />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/editArticle/:articleId" element={<ArticleForm />} />
            <Route path="/explainArticles/:articleId" element={<ExplainArticle />} />
        </Routes>
    );
}

