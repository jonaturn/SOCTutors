import { Box, Typography, Button, TextField, List, ListItem, ListItemText, Divider, Paper } from "@mui/material";
import Navbar from "scenes/navbar";
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";

const ENDPOINT = "https://soctutors.onrender.com";
let socket;

const ChatPage = () => {
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const theme = useTheme();

  const [selectedChat, setSelectedChat] = useState(null);
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (!user || !token) {
      window.location.href = "/";
      return;
    }

    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("message received", (newMessage) => {
      if (selectedChat && newMessage.chat._id === selectedChat._id) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user, token, selectedChat]);

  const fetchChats = async () => {
    try {
      const response = await fetch(`${ENDPOINT}/chats?userId=${user._id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch chats");
      }
      const data = await response.json();
      setChats(data);
    } catch (error) {
      console.error("Error fetching chats:", error);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const response = await fetch(`${ENDPOINT}/messages/${chatId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        const chat = chats.find((chat) => chat._id === chatId); // Find chat in the existing chats array
        setMessages(data);
        setSelectedChat(chat); // Set the whole chat object, not just ID
        socket.emit("join chat", chatId);
      } else {
        console.error("Unexpected data format:", data);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async (messageContent) => {
    if (messageContent) {
      try {
        const response = await fetch(`${ENDPOINT}/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: messageContent,
            chatId: selectedChat?._id,
            senderId: user._id, // Ensure this matches the schema
          }),
        });
        if (!response.ok) {
          throw new Error("Failed to send message");
        }
        const data = await response.json();
        socket.emit("new message", data);
        setMessages((prevMessages) => [...prevMessages, data]);
        setNewMessage(""); // Clear the text field after sending
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const fetchFriends = async () => {
    try {
      const response = await fetch(`${ENDPOINT}/users/${user._id}/friends`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setFriends(data);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchFriends();
      fetchChats();
    }
  }, [user, token]);

  const createChat = async (friendId) => {
    try {

      const response = await fetch(`${ENDPOINT}/chats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          users: [user._id, friendId],
        }),
      });
  
      const newChat = await response.json();
  
      setChats((prevChats) => [newChat, ...prevChats]);
  
      return newChat; // Return newChat to use in fetching messages
    } catch (error) {
      console.error("Error creating chat:", error);
    }
  };

  // Determine if the theme is dark or light
  const isDarkMode = theme.palette.mode === "dark";

  return (
    <Box>
      <Navbar />
      <div style={{ display: "flex", height: "100vh" }}>
        <Paper elevation={3} style={{ width: "30%", padding: "10px", overflowY: "auto" }}>
          <Typography variant="h6">Chats</Typography>
          <List>
            {chats.map((chat) => (
              <ListItem
                button
                key={chat._id}
                onClick={() => fetchMessages(chat._id)}
                selected={selectedChat?._id === chat._id}
              >
                <ListItemText
                  primary={`Chat with ${
                    chat.users?.find((u) => u._id !== user._id)?.firstName || 'Unknown User'
                  }`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
        <div style={{ width: "70%", display: "flex", flexDirection: "column" }}>
          {selectedChat ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <Typography variant="h6" style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
                {`Chat with ${selectedChat.users?.find((u) => u._id !== user._id)?.firstName || 'Unknown User'}`}
              </Typography>
              <div
                style={{
                  flex: 1,
                  padding: "10px",
                  overflowY: "auto",
                  borderBottom: "1px solid #ccc",
                }}
              >
                {messages.map((message) => (
                  <div
                    key={message._id}
                    style={{
                      marginBottom: "10px",
                      backgroundColor: message.sender._id === user._id
                        ? isDarkMode ? "#004d40" : "#e0f7fa"
                        : isDarkMode ? "#263238" : "#f1f8e9",
                      padding: "10px",
                      borderRadius: "5px",
                      color: isDarkMode && message.sender._id !== user._id ? "#e0e0e0" : "inherit",
                    }}
                  >
                    <Typography variant="body1">
                      <strong>{message.sender.firstName} {message.sender.lastName}:</strong> {message.content}
                    </Typography>
                  </div>
                ))}
              </div>
              <div style={{ padding: "10px", borderTop: "1px solid #ccc", display: "flex", alignItems: "center" }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); // Prevent the default action (e.g., form submission)
                      sendMessage(newMessage); // Pass the content to sendMessage
                    }
                  }}
                  style={{ marginRight: "10px" }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => sendMessage(newMessage)} // Pass the content to sendMessage
                >
                  Send
                </Button>
              </div>
            </div>
          ) : (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Typography variant="h6">Select a chat to start messaging</Typography>
            </div>
          )}
        </div>
      </div>
    </Box>
  );
};

export default ChatPage;
