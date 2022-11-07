import Tweet from "components/Tweet";
import { authService, dbService } from "fbase";
import { updateProfile } from "firebase/auth";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import "../css/profile.css";

const { useState, useEffect } = require("react");
const Profile = ({ userObj, refreshUser }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const [myTweets, setMyTweets] = useState([]);
  const navigate = useNavigate();
  const onLogOutClick = () => {
    authService.signOut();
    navigate("/");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(authService.currentUser, {
        displayName: newDisplayName,
      });
      refreshUser();
    }
  };
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNewDisplayName(value);
  };
  const getMyTweets = async () => {
    const q = query(
      collection(dbService, "tweets"),
      where("creatorId", "==", userObj.uid),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (snapshot) => {
      const tweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMyTweets(tweetArr);
    });
  };

  useEffect(() => {
    getMyTweets();
  }, []);
  return (
    <section className="tweet_area">
      <form className="profile" onSubmit={onSubmit}>
        <div>
          <img src={userObj.photoURL} loading="lazy" />
          <input
            onChange={onChange}
            type="text"
            placeholder="계정이름"
            maxLength={30}
            value={newDisplayName}
            required
          />
          <input type="submit" value="수정" />
        </div>
        <button onClick={onLogOutClick}>
          <FontAwesomeIcon icon={faRightFromBracket} />
          로그아웃
        </button>
      </form>
      <div>
        <div className="my_tweet">
          <p>나의 트윗</p>
        </div>
        {myTweets.map((mytweet) => (
          <Tweet
            key={mytweet.id}
            tweetObj={mytweet}
            isOwner={mytweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </section>
  );
};

export default Profile;
