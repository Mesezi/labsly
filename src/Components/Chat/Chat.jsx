import React, { useState, useEffect, useRef } from "react";
import { useAuth } from '../authContext'
import { database } from "../../fireBaseConfig";
import { addDoc,  query,
  collection,
  orderBy,
  onSnapshot,
  limit, serverTimestamp } from "firebase/firestore";

import './Chat.css'

const Chat = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const {auth, userData} = useAuth()

  const scroll = useRef();

  const sendMessage = async (event) => {
    event.preventDefault();
    if (message.trim() === "") {
      alert("Enter valid message");
      return;
    }
    const { uid, username, imageUrl } = userData;

    await addDoc(collection(database, "messages"), {
      text: message,
      name: username,
      avatar: imageUrl,
      createdAt: serverTimestamp(),
      uid,
    }); 

    setMessage("");

    scroll.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scroll.current.scrollIntoView({ behavior: "smooth" });
    const q = query(
      collection(database, "messages"),
      orderBy("createdAt"),
      limit(100)
    );
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      let messages = [];
      QuerySnapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });

    return () => unsubscribe;

  }, []);


  return (
    <section className='relative w-full chat'>

<article className='min-h-[90vh]'>
{messages?.map((message) => (
          // <Message key={message.id} message={message} />


          <div key={message.id}
      className={`chat-bubble ${message.uid === userData.uid ? "right" : ""}`}>
        <img 
        src={message.avatar}
        alt="user avatar"
      />
      <div>
        <p className="user-name font-semibold">{message.name}</p>
        <p className="user-message text-sm">{message.text}</p>
      </div>
    </div>
          
        ))}
        <div ref={scroll}  className='w-full h-28 md:h-14'> </div>
</article>
<form onSubmit={sendMessage} className="fixed md:sticky left-0 bottom-0 w-full h-14 flex messageForm">
<label htmlFor="messageInput" hidden>
        Enter Message
      </label>
      <input
        id="messageInput"
        name="messageInput"
        type="text"
        className="form-input__input grow px-4"
        placeholder="type message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />
      <button type="submit" className='px-5 bg-black'>Send</button>
</form>



    </section>
  )
}

export default Chat