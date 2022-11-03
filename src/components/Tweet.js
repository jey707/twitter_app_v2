import { dbService, storageService } from "fbase";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadString,
} from "firebase/storage";
import { useRef, useState } from "react";
import { v4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { faImage } from "@fortawesome/free-regular-svg-icons";

const Tweet = ({ tweetObj, isOwner }) => {
  const [fileChange, setFileCange] = useState(false);
  const tweetTextRef = doc(dbService, "tweets", `${tweetObj.id}`);
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text);
  const [attachment, setAttachment] = useState(tweetObj.attachmentUrl);
  const [createdAt, setCreatedAt] = useState(tweetObj.createdAt);
  const fileInput = useRef();
  const date = new Date(tweetObj.createdAt);
  tweetObj.createdAt =
    date.getFullYear() + "." + (date.getMonth() + 1) + "." + date.getDate();
  // 삭제 또는 수정 이미지 파일 ref생성
  let desertRef = ref(storageService, tweetObj.attachmentUrl);
  console.log(new Date(tweetObj.createdAt));
  const onDelete = async () => {
    const ok = window.confirm("해당 트윗을 삭제하시겠습니까?");
    if (ok) {
      await deleteDoc(tweetTextRef);
      if (tweetObj.attachmentUrl !== "") {
        await deleteObject(desertRef);
      }
      updateDoc();
    }
  };
  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (e) => {
    e.preventDefault();
    let attachmentUrl = "";
    if ((attachment !== "" || !desertRef._location.path_) && fileChange) {
      if (!desertRef._location.path_) {
        desertRef = ref(storageService, `${tweetObj.creatorId}/${v4()}`);
      } else {
        await deleteObject(desertRef);
      }

      // const attachmentRef = ref(storageService, `${userObj.uid}/${v4()}`);
      const response = await uploadString(desertRef, attachment, "data_url");
      attachmentUrl = await getDownloadURL(response.ref);
    }
    ////////////////db업데이트 부분/////////////////
    if ((attachment !== "" || !desertRef._location.path_) && fileChange) {
      await updateDoc(tweetTextRef, {
        text: newTweet,
        attachmentUrl,
      });
    } else {
      await updateDoc(tweetTextRef, {
        text: newTweet,
        // attachmentUrl,
      });
    }

    setEditing(false);
  };
  const onChange = (e) => setNewTweet(e.target.value);
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
    setFileCange((prev) => !prev);
  };

  return (
    <div className="tweet_show" key={tweetObj.id}>
      {editing ? (
        <>
          {isOwner && (
            <>
              <form onSubmit={onSubmit}>
                <div className="writer">
                  <img
                    className="writer_img"
                    src={tweetObj.creatorImage}
                    loading="lazy"
                  />
                  <input
                    type="text"
                    onChange={onChange}
                    placeholder="트윗을 수정해 주세요."
                    value={newTweet}
                    maxLength="120"
                    required
                    className="text_input"
                  />
                  {/* 수정첨부파일 넣는곳 */}
                  <label htmlFor="edit_file">
                    <FontAwesomeIcon icon={faImage} className="file_icon" />
                  </label>
                  <input
                    type="file"
                    className="add_file"
                    accept="image/*"
                    onChange={onFileChange}
                    ref={fileInput}
                    id="edit_file"
                  />
                </div>
                {attachment && (
                  <div className="tweet_attach_img">
                    <img
                      src={attachment}
                      alt="트윗 첨부이미지"
                      className="tweet_img"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="edit_btn">
                  <input type="submit" value="수정" />
                  <button onClick={toggleEditing}>취소</button>
                </div>
              </form>
            </>
          )}
        </>
      ) : (
        <>
          <div className="writer">
            <img className="writer_img" src={tweetObj.creatorImage} />
            <div className="writer_info">
              <p className="writer_name">{tweetObj.creatorName}</p>
              <p>{tweetObj.createdAt}</p>
            </div>
          </div>
          <div className="tweet_content">
            <h4 className="tweet_title">{tweetObj.text}</h4>
            {tweetObj.attachmentUrl && (
              <img
                className="tweet_img"
                src={attachment}
                alt="트윗 첨부이미지"
                loading="lazy"
              />
            )}
            {isOwner && (
              <div className="tweet_edit">
                <button onClick={toggleEditing}>
                  <FontAwesomeIcon icon={faPencilAlt} />
                </button>
                <button onClick={onDelete}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Tweet;
