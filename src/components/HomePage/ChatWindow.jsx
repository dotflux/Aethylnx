import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import MessageBox from "./MessageBox";
import ChatBox from "./ChatBox";
import io from "socket.io-client";
import defaultPfp from "../../assets/defaultPfp.png";
import UserInfoPopup from "./UserInfoPopup";
import { toast, Bounce } from "react-toastify";
import { chatWindowSocketHandler } from "./chatWindowSocketHandler";
import TypingIndicator from "./TypingIndicator";
import ReplyBar from "./ReplyBar";
import ChatWindowHeader from "./ChatWindowHeader";

const socket = io("http://localhost:3000");

const ChatWindow = ({ user }) => {
  const [autoScroll, setAutoScroll] = useState(true);
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [recieverInfo, setReciever] = useState(null);
  const [isTyping, setTyping] = useState(false);
  const [typingId, setTypingId] = useState(null);
  const bottomRef = useRef(null);
  const searchRef = useRef(null);
  const chatWindowRef = useRef(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentChannel = queryParams.get("channel");
  const [popupMessageId, setPopupMessageId] = useState(null);
  const [showPopup, setPopup] = useState(false);
  const [replyTo, setReply] = useState(null);
  const [repliedContent, setRepliedContent] = useState(null);

  const fetchMessages = async () => {
    if (!user || !currentChannel) return;
    try {
      const response = await fetch(
        `http://localhost:3000/messages/${currentChannel}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const result = await response.json();
      if (result.valid && response.ok) {
        setMessages(result.messages);
        setFilteredMessages(result.messages);
        setReciever(result.recieverInfo);
      } else {
        if (result.recieverInfo) {
          setReciever(result.recieverInfo);
        }
        console.error(result.error);
        return;
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Handle scroll event
  const handleScroll = () => {
    if (chatWindowRef.current) {
      const isAtBottom =
        chatWindowRef.current.scrollHeight -
          chatWindowRef.current.scrollTop -
          chatWindowRef.current.clientHeight <
        10;
      if (!isAtBottom) {
        setAutoScroll(false);
      } else {
        setAutoScroll(true);
      }
    }
  };

  // Scroll to bottom if auto-scroll is enabled
  useEffect(() => {
    if (autoScroll) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, autoScroll]);

  useEffect(() => {
    // Reset reply state when channel changes
    setReply(null);
    setRepliedContent(null);
  }, [currentChannel]);

  chatWindowSocketHandler({
    user,
    socket,
    currentChannel,
    setMessages,
    messages,
    fetchMessages,
    toast,
    setTypingId,
    setTyping,
    typingId,
    Bounce,
  });

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = messages.filter((msg) =>
      msg.message.toLowerCase().includes(query)
    );
    setFilteredMessages(filtered);
    if (filtered.length > 0) {
      // Scroll to the first matched message
      const matchedMessage = document.getElementById(filtered[0]._id);
      if (matchedMessage) {
        matchedMessage.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  return (
    <div
      ref={chatWindowRef}
      onScroll={handleScroll}
      className={`fixed top-0 left-0 bottom-16 right-0 ${
        currentChannel && "md:left-72"
      } p-4 bg-gradient-to-b from-gray-800 to-gray-900 flex-1 overflow-y-auto ${
        currentChannel ? "z-30" : "z-10"
      }`}
    >
      <ChatWindowHeader
        handleSearch={handleSearch}
        searchRef={searchRef}
        currentChannel={currentChannel}
        recieverInfo={recieverInfo}
        setPopup={setPopup}
        showPopup={showPopup}
        defaultPfp={defaultPfp}
      />
      {showPopup && (
        <div className="ml-12">
          <UserInfoPopup
            avatarUrl={recieverInfo?.avatarURL || defaultPfp}
            username={recieverInfo?.username || ""}
            displayname={recieverInfo?.displayName || ""}
            isActive={recieverInfo?.isActive || false}
            bio={recieverInfo?.bio || ""}
            showSocialButtons={true}
            id={recieverInfo.id}
            closePopup={() => setPopup(false)}
            isBlocked={recieverInfo.isBlocked}
          />
        </div>
      )}

      <div className="flex-1 overflow-y-auto mt-20 mb-12 md:mb-12 md:ml-3 md:mt-20 justify-start items-start">
        {currentChannel ? (
          filteredMessages && filteredMessages.length > 0 ? (
            filteredMessages.map((message, index) => (
              <MessageBox
                key={message._id || index}
                messageContent={message.message}
                senderId={message.senderId}
                lastSenderId={
                  index > 0 ? filteredMessages[index - 1].senderId : null
                }
                createdAt={message.createdAt}
                lastCreatedAt={
                  index > 0 ? filteredMessages[index - 1].createdAt : null
                }
                messageId={message._id}
                userId={user._id}
                isEdited={message.edited}
                popupMessageId={popupMessageId}
                setPopupMessageId={setPopupMessageId}
                fileUrl={message.fileUrl}
                fileType={message.fileType}
                setPopup={setPopup}
                showPopup={showPopup}
                isBlocked={recieverInfo.isBlocked}
                setReply={setReply}
                repliedMessages={message.replyTo}
                setRepliedContent={setRepliedContent}
                blockedUsers={user.blockedUsers}
              />
            ))
          ) : (
            <h1 className="text-center mt-60 text-white">
              No messages available
            </h1>
          )
        ) : (
          <h1 className="text-center mt-60 text-white">
            Chat is displayed here
          </h1>
        )}
      </div>
      <div className="relative">
        {currentChannel && typingId == currentChannel && (
          <TypingIndicator typerUser={recieverInfo?.username} />
        )}
      </div>

      {replyTo && currentChannel == recieverInfo?.id && (
        <ReplyBar
          setRepliedContent={setRepliedContent}
          setReply={setReply}
          repliedContent={repliedContent}
        />
      )}
      {currentChannel && (
        <ChatBox
          currentChannel={currentChannel}
          userId={user._id}
          isTyping={isTyping}
          setTyping={setTyping}
          recieverId={currentChannel}
          userAvatar={user?.avatarURL || defaultPfp}
          userUsername={user.username}
          userDisplayName={user.displayName}
          replyTo={replyTo}
          isGroup={false}
        />
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatWindow;
