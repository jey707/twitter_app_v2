import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React from "react";
import AuthForm from "../components/AuthForm";
import { authService, dbService } from "../fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faGoogle,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import "../css/auth.css";
const Auth = () => {
  const onSocialClick = async (e) => {
    const {
      target: { name },
    } = e;
    let provider;
    if (name === "google") {
      provider = new GoogleAuthProvider();
    } else if (name === "github") {
      provider = new GithubAuthProvider();
    }
    const data = await signInWithPopup(authService, provider);

    const socialData = {
      imageURL: data.user.photoURL,
      userId: data.user.uid,
    };
    const q = query(
      collection(dbService, "userProfile"),
      where("userId", "==", data.user.uid)
    );
    onSnapshot(q, (snapshot) => {
      const profileExist = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      if (profileExist.length === 0) {
        addDoc(collection(dbService, "userProfile"), socialData);
      }
    });
  };
  return (
    <section className="auth_sec">
      <div className="authForm">
        <div className="auth_icon">
          <FontAwesomeIcon icon={faTwitter} color={"#04AAFF"} size="2x" />
          <p>로그인하기</p>
        </div>
        <div className="authForm_box">
          <AuthForm />
          <div className="social_btn">
            <button onClick={onSocialClick} name="google">
              <FontAwesomeIcon icon={faGoogle} />
              Google로그인
            </button>
            <button onClick={onSocialClick} name="github">
              <FontAwesomeIcon icon={faGithub} />
              Github로그인
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Auth;
