import { dbService, storageService } from "fbase";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useState, useRef } from "react";
import { v4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faImage } from "@fortawesome/free-regular-svg-icons";

const TweetAdd = ({ userObj }) => {
  const [tweet, setTweet] = useState("");
  const [attachment, setAttachment] = useState("");
  const [overlap, setOverlap] = useState(true);
  const fileInput = useRef();
  const onSubmit = async (e) => {
    e.preventDefault();
    // 중복등록 방지
    if (!overlap) {
      return;
    }
    setOverlap(false);
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = ref(storageService, `${userObj.uid}/${v4()}`);
      const response = await uploadString(
        attachmentRef,
        attachment,
        "data_url"
      );
      attachmentUrl = await getDownloadURL(response.ref);
    }

    const tweetObj = {
      text: tweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      creatorName: userObj.displayName,
      creatorImage: userObj.photoURL,
      attachmentUrl,
    };
    await addDoc(collection(dbService, "tweets"), tweetObj);
    setTweet("");
    setAttachment("");
    fileInput.current.value = null;
    setOverlap(true);
  };
  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setTweet(value);
  };
  const onFileChange = (e) => {
    const {
      target: { files },
    } = e;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (fileEndEvent) => {
      const {
        currentTarget: { result },
      } = fileEndEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  // const fileInput = useRef();
  const onClearAttachmentClick = () => {
    setAttachment("");
    fileInput.current.value = null;
  };
  return (
    <form onSubmit={onSubmit} className="tweet_form">
      <div className="tweet_form_box">
        <img
          src={userObj.photoURL}
          alt="user prifile"
          className="writer_profile"
        />
        <input
          type="text"
          value={tweet}
          onChange={onChange}
          placeholder="무슨 일이 일어나고 있나요?"
          maxLength={120}
          className="text_input"
          required
        />
        <label htmlFor="add_file">
          <FontAwesomeIcon icon={faImage} className="file_icon" />
        </label>
        <input
          className="add_file"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          ref={fileInput}
          id="add_file"
        />
      </div>

      {attachment && (
        <div className="attach_box">
          <img src={attachment} className="attach_img" alt="첨부파일" />
          <button className="attach_del" onClick={onClearAttachmentClick}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      )}
      <input type="submit" value="트윗" />
    </form>
  );
};

export default TweetAdd;
