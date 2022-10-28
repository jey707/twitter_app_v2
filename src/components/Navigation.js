const { Link } = require("react-router-dom");

const Navigation = ({ userObj = { userObj } }) => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/profile">{userObj.displayName}님의 프로필</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
