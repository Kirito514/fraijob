// Hybrid chat manager with Socket.IO and HTTP polling fallback
import { io } from "socket.io-client";

class ChatManager {
  constructor() {
    this.isConnected = false;
    this.pollingInterval = null;
    this.socket = null;
    this.useSocketIO = true; // Try Socket.IO first
    this.callbacks = {
      newMessage: [],
      messageUpdated: [],
      messageDeleted: [],
      userTyping: [],
      userStoppedTyping: [],
      error: [],
    };
  }

  connect(token) {
    this.token = token;
    this.isConnected = true;

    if (this.useSocketIO) {
      try {
        this.connectSocketIO(token);
      } catch (error) {
        console.warn(
          "Socket.IO connection failed, falling back to HTTP polling:",
          error
        );
        this.useSocketIO = false;
        this.startPolling();
      }
    } else {
      this.startPolling();
    }

    return this;
  }

  connectSocketIO(token) {
    this.socket = io("http://localhost:3001", {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    this.socket.on("connect", () => {
      console.log("✅ Connected to Socket.IO server");
      this.isConnected = true;
    });

    this.socket.on("disconnect", () => {
      console.log("❌ Disconnected from Socket.IO server");
      this.isConnected = false;
    });

    this.socket.on("connect_error", (error) => {
      console.warn(
        "Socket.IO connection error, falling back to HTTP polling:",
        error
      );
      this.useSocketIO = false;
      this.socket = null;
      this.startPolling();
    });

    this.socket.on("new_message", (message) => {
      this.callbacks.newMessage.forEach((callback) => callback(message));
    });

    this.socket.on("message_updated", (updatedMessage) => {
      this.callbacks.messageUpdated.forEach((callback) =>
        callback(updatedMessage)
      );
    });

    this.socket.on("message_deleted", ({ messageId }) => {
      this.callbacks.messageDeleted.forEach((callback) =>
        callback({ messageId })
      );
    });

    this.socket.on("error", (error) => {
      this.callbacks.error.forEach((callback) => callback(error));
    });

    this.socket.on("user_typing", ({ userId, userName }) => {
      this.callbacks.userTyping?.forEach((callback) =>
        callback({ userId, userName })
      );
    });

    this.socket.on("user_stopped_typing", ({ userId }) => {
      this.callbacks.userStoppedTyping?.forEach((callback) =>
        callback({ userId })
      );
    });
  }

  disconnect() {
    this.isConnected = false;

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }

    console.log("Chat manager disconnected");
  }

  startPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }

    this.pollingInterval = setInterval(async () => {
      if (!this.isConnected) return;

      try {
        const response = await fetch("/api/chats", {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          // This will be handled by the component's useEffect
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 2000);
  }

  async sendMessage(message) {
    if (!this.isConnected) return;

    if (this.useSocketIO && this.socket) {
      // Use Socket.IO
      this.socket.emit("send_message", { message });
    } else {
      // Use HTTP API
      try {
        const response = await fetch("/api/chats", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token}`,
          },
          body: JSON.stringify({ message }),
        });

        if (response.ok) {
          const newMessage = await response.json();
          // Trigger callbacks for HTTP mode
          this.callbacks.newMessage.forEach((callback) => callback(newMessage));
          return newMessage;
        } else {
          throw new Error("Failed to send message");
        }
      } catch (error) {
        console.error("Error sending message:", error);
        this.callbacks.error.forEach((callback) => callback(error.message));
      }
    }
  }

  async editMessage(messageId, message) {
    if (!this.isConnected) return;

    if (this.useSocketIO && this.socket) {
      // Use Socket.IO
      this.socket.emit("edit_message", { messageId, message });
    } else {
      // Use HTTP API
      try {
        const response = await fetch(`/api/chats/${messageId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token}`,
          },
          body: JSON.stringify({ message }),
        });

        if (response.ok) {
          const updatedMessage = await response.json();
          this.callbacks.messageUpdated.forEach((callback) =>
            callback(updatedMessage)
          );
          return updatedMessage;
        } else {
          throw new Error("Failed to edit message");
        }
      } catch (error) {
        console.error("Error editing message:", error);
        this.callbacks.error.forEach((callback) => callback(error.message));
      }
    }
  }

  async deleteMessage(messageId) {
    if (!this.isConnected) return;

    if (this.useSocketIO && this.socket) {
      // Use Socket.IO
      this.socket.emit("delete_message", { messageId });
    } else {
      // Use HTTP API
      try {
        const response = await fetch(`/api/chats/${messageId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        });

        if (response.ok) {
          this.callbacks.messageDeleted.forEach((callback) =>
            callback({ messageId })
          );
          return true;
        } else {
          throw new Error("Failed to delete message");
        }
      } catch (error) {
        console.error("Error deleting message:", error);
        this.callbacks.error.forEach((callback) => callback(error.message));
      }
    }
  }

  // Typing indicators
  startTyping() {
    if (this.useSocketIO && this.socket) {
      this.socket.emit("typing_start");
    }
    // For HTTP-based chat, we skip typing indicators
  }

  stopTyping() {
    if (this.useSocketIO && this.socket) {
      this.socket.emit("typing_stop");
    }
    // For HTTP-based chat, we skip typing indicators
  }

  // Event listeners
  onNewMessage(callback) {
    this.callbacks.newMessage.push(callback);
  }

  onMessageUpdated(callback) {
    this.callbacks.messageUpdated.push(callback);
  }

  onMessageDeleted(callback) {
    this.callbacks.messageDeleted.push(callback);
  }

  onUserTyping(callback) {
    this.callbacks.userTyping.push(callback);
  }

  onUserStoppedTyping(callback) {
    this.callbacks.userStoppedTyping.push(callback);
  }

  onError(callback) {
    this.callbacks.error.push(callback);
  }
}

// Singleton instance
const chatManager = new ChatManager();
export default chatManager;
