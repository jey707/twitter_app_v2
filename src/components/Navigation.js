const { Link } = require("react-router-dom");

const Navigation = ({ userObj = { userObj } }) => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <img
            src={userObj.photoURL}
            alt="프로필 이미지"
            width="50px"
            height="50px"
          />
          <Link to="/profile">{userObj.displayName}님의 프로필</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
