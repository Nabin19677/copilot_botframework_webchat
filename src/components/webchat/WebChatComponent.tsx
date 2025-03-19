import { useState, useEffect, useMemo } from "react";
import ReactWebChat, { createDirectLine } from "botframework-webchat";

const userId = "user_1234";
const userName = "Default BOT User";

const getTokenUrl = "";

const Secret = "";

const ChatComponent = () => {
  const [token, setToken] = useState<string>();
  const [loading, setLoading] = useState(false);

  const directLine = useMemo(() => {
    if (!token) return null;
    const dl = createDirectLine({ token, secret: Secret });

    // Start Conversation with bot
    dl.postActivity({
      type: "event",
      from: { id: userId, name: userName },
      // OnConversationStart is manual event created on trigger for Conversation Start Topic
      name: "OnConversationStart",
      value: {},
    }).subscribe();

    return dl;
  }, [token]);

  const getToken = async () => {
    try {
      setLoading(true);
      const response = await fetch(getTokenUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Secret}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
      } else {
        console.error(
          "Failed to fetch token",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error fetching token:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!token || !directLine) {
    return <div>Failed to load token or initialize chat.</div>;
  }

  return (
    <div style={{ height: "100vh" }}>
      <ReactWebChat
        directLine={directLine}
        locale="en-US"
        userID={userId}
        username={userName}
        styleOptions={{
          bubbleBackground: "rgba(0, 0, 255, .1)",
          bubbleFromUserBackground: "rgba(0, 255, 0, .1)",
          backgroundColor: "paleturquoise",
          botAvatarInitials: "BF",
          userAvatarInitials: "WC",
        }}
      />
    </div>
  );
};

export default ChatComponent;
