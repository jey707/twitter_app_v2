import { dbService } from "fbase";
import { addDoc, collection } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import "../css/auth.css";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");
  const onChange = (e) => {
    const {
      target: { name, value },
    } = e;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    let data;
    let firstUser = false;
    try {
      const auth = getAuth();
      if (newAccount) {
        data = await createUserWithEmailAndPassword(auth, email, password);
        firstUser = true;
      } else {
        data = await signInWithEmailAndPassword(auth, email, password);
        firstUser = false;
      }
    } catch (error) {
      const erMsg = error.message;
      if (erMsg.includes("invalid-email")) {
        setError("유효하지않는 이메일입니다.");
      } else if (erMsg.includes("email-already-in-use")) {
        setError("이미존재하는 계정입니다.");
      } else if (erMsg.includes("weak-password")) {
        setError("암호는 6자이상이여야합니다.");
      } else {
        setError("이메일, 비밀번호를 양식에 맞게 입력해주세요");
      }
    }
    if (firstUser) {
      userProfileImg(data);
    }
  };

  const userProfileImg = async (data) => {
    const userProfile = {
      userId: data.user.uid,
      imageURL: "profile.jpg",
    };
    //회원가입시
    await addDoc(collection(dbService, "userProfile"), userProfile);
  };
  const toggleAccount = () => setNewAccount((prev) => !prev);
  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="Email"
          name="email"
          onChange={onChange}
          value={email}
          required
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={onChange}
          required
        />
        <input type="submit" value={newAccount ? "회원가입" : "로그인"} />
        <p className="error_msg">{error}</p>
      </form>
      <hr className="hr" />
      <span className="toggle_account" onClick={toggleAccount}>
        {newAccount ? "로그인하기" : "회원가입하기"}
      </span>
    </>
  );
};

export default AuthForm;
