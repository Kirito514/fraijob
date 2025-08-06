import { io } from 'socket.io-client';

class SocketManager {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(token) {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    this.socket = io('http://localhost:3001', {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Connected to Socket.IO');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO');
      this.isConnected = false;
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  sendMessage(message) {
    if (this.socket && this.isConnected) {
      this.socket.emit('send_message', { message });
    }
  }

  editMessage(messageId, message) {
    if (this.socket && this.isConnected) {
      this.socket.emit('edit_message', { messageId, message });
    }
  }

  deleteMessage(messageId) {
    if (this.socket && this.isConnected) {
      this.socket.emit('delete_message', { messageId });
    }
  }

  startTyping() {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing_start');
    }
  }

  stopTyping() {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing_stop');
    }
  }

  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on('new_message', callback);
    }
  }

  onMessageUpdated(callback) {
    if (this.socket) {
      this.socket.on('message_updated', callback);
    }
  }

  onMessageDeleted(callback) {
    if (this.socket) {
      this.socket.on('message_deleted', callback);
    }
  }

  onUserTyping(callback) {
    if (this.socket) {
      this.socket.on('user_typing', callback);
    }
  }

  onUserStoppedTyping(callback) {
    if (this.socket) {
      this.socket.on('user_stopped_typing', callback);
    }
  }

  onError(callback) {
    if (this.socket) {
      this.socket.on('error', callback);
    }
  }
}

// Singleton instance
const socketManager = new SocketManager();
export default socketManager; 