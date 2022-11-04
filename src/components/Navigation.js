import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faUser, faHome } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "../css/navigation.css";

const Navigation = ({ userObj = { userObj } }) => {
  return (
    <nav className="menu_bar">
      <div className="home_icon">
        <Link to="/">
          <FontAwesomeIcon icon={faTwitter} size="2x" color={"#04AAFF"} />
        </Link>{" "}
      </div>
      <ul className="menu_list">
        <li>
          <Link to="/" style={{ textDecoration: "none" }} className="menu_link">
            <div className="menu_icon">
              <FontAwesomeIcon icon={faHome} />
            </div>
            <div className="menu_name">Home</div>
          </Link>
        </li>
        <li>
          <Link
            to="/profile"
            style={{ textDecoration: "none" }}
            className="menu_link"
          >
            <div className="menu_icon">
              <FontAwesomeIcon icon={faUser} />
            </div>
            {/* <img
              src={userObj.photoURL}
              alt="프로필 이미지"
              width="50px"
              height="50px"
            /> */}
            <div className="menu_name">프로필</div>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
