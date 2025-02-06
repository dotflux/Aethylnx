import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import MessageBox from "./MessageBox";
import ChatBox from "./ChatBox";
import io from "socket.io-client";
import defaultPfp from "../../assets/defaultPfp.png";
import { toast, Bounce } from "react-toastify";
import openGroupSidebar from "../../assets/openGroupSide.svg";
import GroupSideBar from "./GroupSideBar";
import { useNavigate } from "react-router-dom";
import { groupChatSockets } from "./groupChatSocketHandler.jsx";
import GroupChatHeader from "./GroupChatHeader.jsx";
import ReplyBar from "./ReplyBar.jsx";
import TypingIndicator from "./TypingIndicator.jsx";

const socket = io("http://localhost:3000");

const GroupChatWindow = ({ user }) => {
  const navigate = useNavigate();
  const [autoScroll, setAutoScroll] = useState(true);
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [groupInfo, setGroupInfo] = useState(null);
  const [isTyping, setTyping] = useState(false);
  const [typingId, setTypingId] = useState(null);
  const bottomRef = useRef(null);
  const searchRef = useRef(null);
  const chatWindowRef = useRef(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currentChannel = queryParams.get("groupId");
  const [popupMessageId, setPopupMessageId] = useState(null);
  const [showPopup, setPopup] = useState(false);
  const [replyTo, setReply] = useState(null);
  const [repliedContent, setRepliedContent] = useState(null);
  const [senderInfo, setSender] = useState(null);
  const [typerUser, setTyperUser] = useState(null);
  const [typingChannel, setTypingChannel] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);

  const fetchMessages = async () => {
    if (!user || !currentChannel) return;
    try {
      const response = await fetch(
        `http://localhost:3000/messages/group/${currentChannel}`,
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
        setGroupInfo(result.groupInfo);
      } else {
        if (result.groupInfo) {
          setGroupInfo(result.groupInfo);
        }
        console.error(result.error);
        return;
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  groupChatSockets({
    navigate,
    socket,
    user,
    currentChannel,
    setMessages,
    messages,
    fetchMessages,
    toast,
    setTypingId,
    setTyperUser,
    setTyping,
    groupInfo,
    Bounce,
    setTypingChannel,
    setGroupInfo,
  });
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
      <GroupChatHeader
        currentChannel={currentChannel}
        setPopup={setPopup}
        groupInfo={groupInfo}
        defaultPfp={defaultPfp}
        handleSearch={handleSearch}
        searchRef={searchRef}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        openGroupSidebar={openGroupSidebar}
      />

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
                isBlocked={user.blockedUsers.includes(message.senderId)}
                setReply={setReply}
                repliedMessages={message.replyTo}
                setRepliedContent={setRepliedContent}
                setSender={setSender}
                isSystem={message.system}
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
        {currentChannel &&
          typingId &&
          typingId != user?._id &&
          currentChannel == typingChannel && (
            <TypingIndicator typerUser={typerUser} />
          )}
      </div>

      {replyTo && (
        <ReplyBar
          setRepliedContent={setRepliedContent}
          repliedContent={repliedContent}
          setReply={setReply}
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
          userUsername={user?.username}
          userDisplayName={user?.displayName}
          replyTo={replyTo}
          isGroup={true}
          groupParticipants={groupInfo?.participants}
        />
      )}
      {currentChannel && (
        <>
          {showSidebar && (
            <GroupSideBar
              setShowSidebar={setShowSidebar}
              participantsInGroup={groupInfo?.participants}
              user={user}
              groupId={groupInfo.id}
              admins={groupInfo.admins}
              socket={socket}
              groupInfo={groupInfo}
            />
          )}
        </>
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default GroupChatWindow;
