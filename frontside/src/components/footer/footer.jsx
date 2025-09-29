import { MyContext } from "../../App";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faCircleInfo, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import './footer.css';
export default function Footer() {
    const { detoken } = useContext(MyContext);
    const navigate = useNavigate();

    return (
        <footer>
            <ul className="footerUl">
                {detoken && (detoken?.isAdmin) && (
                    <div className="IconsDiv" onClick={() => navigate('/MyArticles')}>
                        <FontAwesomeIcon
                            icon={faUserCircle}
                            onClick={() => navigate('/MyArticles')}
                            className="icon-hover"
                            style={{ cursor: 'pointer', marginLeft: '10px' }}
                            title="My articles"
                        />
                        <span>My Articles</span>
                    </div>
                )}
                <p>© 2025</p>
            </ul>
        </footer>
    )
}
