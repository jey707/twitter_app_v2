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

const Tweet = ({ tweetObj, isOwner }) => {
  // console.log(tweetObj);
  const [fileChange, setFileCange] = useState(false);
  const tweetTextRef = doc(dbService, "tweets", `${tweetObj.id}`);
  const [editing, setEditing] = useState(false);
  const [newTweet, setNewTweet] = useState(tweetObj.text);
  const [attachment, setAttachment] = useState(tweetObj.attachmentUrl);
  const fileInput = useRef();
  // 삭제하려는 이미지 파일 ref생성
  let desertRef = ref(storageService, tweetObj.attachmentUrl);

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
    console.log("desertRef", desertRef);
    console.log("desertRef", !desertRef._location.path_);
    let attachmentUrl = "";
    console.log("attachment", attachment);
    console.log("fileChange", fileChange);
    if ((attachment !== "" || !desertRef._location.path_) && fileChange) {
      // if (tweetObj.attachmentUrl !== "") {
      console.log("이미지드간다");

      if (!desertRef._location.path_) {
        console.log("없다가 새로이미지넣기");
        desertRef = ref(storageService, `${tweetObj.creatorId}/${v4()}`);
      } else {
        await deleteObject(desertRef);
      }

      // }
      // const attachmentRef = ref(storageService, `${userObj.uid}/${v4()}`);
      const response = await uploadString(desertRef, attachment, "data_url");
      attachmentUrl = await getDownloadURL(response.ref);
      console.log("attachmentUrl", attachmentUrl);
      console.log("response.ref", response.ref);
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
    <div key={tweetObj.id}>
      {editing ? (
        <>
          {isOwner && (
            <>
              <form onSubmit={onSubmit}>
                <input
                  type="text"
                  onChange={onChange}
                  placeholder="트윗을 작성해주세요!!"
                  value={newTweet}
                  required
                />
                {/* 수정첨부파일 넣는곳 */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={onFileChange}
                  ref={fileInput}
                />
                {attachment && (
                  <div>
                    <img
                      src={attachment}
                      alt="트윗 첨부이미지"
                      width="100px"
                      height="100px"
                    />
                  </div>
                )}

                <input type="submit" value="트윗업데이트" />
                <button onClick={toggleEditing}>Cancel</button>
              </form>
            </>
          )}
        </>
      ) : (
        <>
          <img src={tweetObj.creatorImage} width="50px" height="50px" />
          <h4>{tweetObj.text}</h4>
          {tweetObj.attachmentUrl && (
            <img
              src={attachment}
              alt="트윗 첨부이미지"
              width="100px"
              height="100px"
            />
          )}
          {isOwner && (
            <>
              <button onClick={toggleEditing}>트윗수정</button>
              <button onClick={onDelete}>트윗삭제</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Tweet;
