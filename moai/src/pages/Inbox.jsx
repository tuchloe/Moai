import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/api"; // Axios instance
import Header from "../components/Header/Header";
import "../styles/Inbox.scss";

const Inbox = () => {
  const { user } = useAuth(); // Get logged-in user
  const [friends, setFriends] = useState([]); // List of friends
  const [selectedFriend, setSelectedFriend] = useState(null); // Active chat
  const [messages, setMessages] = useState([]); // Messages
  const [newMessage, setNewMessage] = useState(""); // New message input

  // ✅ Fetch user's friends
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await api.get(`/api/friends/${user.account_id}`);
        setFriends(response.data);
      } catch (error) {
        console.error("❌ Error fetching friends:", error);
      }
    };

    if (user) {
      fetchFriends();
    }
  }, [user]);

  // ✅ Fetch messages when a friend is selected
  useEffect(() => {
    if (selectedFriend) {
      const fetchMessages = async () => {
        try {
          const response = await api.get(
            `/api/messages/${user.account_id}/${selectedFriend.friend_account_id}`
          );
          setMessages(response.data);
        } catch (error) {
          console.error("❌ Error fetching messages:", error);
        }
      };

      fetchMessages();
    }
  }, [selectedFriend, user]);

  // ✅ Send a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await api.post("/api/messages/send", {
        senderId: user.account_id,
        receiverId: selectedFriend.friend_account_id,
        content: newMessage,
      });

      // Update UI with new message
      setMessages([...messages, { sender_account_id: user.account_id, content: newMessage }]);
      setNewMessage("");
    } catch (error) {
      console.error("❌ Error sending message:", error);
    }
  };

  return (
    <div className="inbox">
      <Header />
      <div className="inbox__container">
        {/* ✅ Sidebar: List of Friends */}
        <div className="inbox__sidebar">
          <h2>Friends</h2>
          {friends.length === 0 ? (
            <p>No friends yet.</p>
          ) : (
            <ul>
              {friends.map((friend) => (
                <li
                  key={friend.friend_account_id}
                  className={selectedFriend?.friend_account_id === friend.friend_account_id ? "active" : ""}
                  onClick={() => setSelectedFriend(friend)}
                >
                  {friend.first_name} {friend.last_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ✅ Chat Section */}
        <div className="inbox__chat">
          {selectedFriend ? (
            <>
              <h2>Chat with {selectedFriend.first_name}</h2>
              <div className="inbox__messages">
                {messages.length === 0 ? (
                  <p>No messages yet.</p>
                ) : (
                  messages.map((msg, index) => (
                    <div key={index} className={msg.sender_account_id === user.account_id ? "sent" : "received"}>
                      <p>{msg.content}</p>
                    </div>
                  ))
                )}
              </div>

              {/* ✅ Message Input */}
              <form className="inbox__form" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit">Send</button>
              </form>
            </>
          ) : (
            <p>Select a friend to start chatting.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inbox;
