const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Use environment JWT_SECRET from .env.local
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('JWT_SECRET not found in environment variables!');
  process.exit(1);
}

const io = new Server(3001, {
  cors: {
    origin: ["http://localhost:3000","http://localhost:3001", "http://localhost:3002"],
    methods: ["GET", "POST"]
  }
});

// Authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    console.log('No token provided');
    return next(new Error('Authentication error'));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) {
      console.log('Invalid token');
      return next(new Error('Invalid token'));
    }
    socket.userId = decoded.id;
    socket.userName = decoded.name || decoded.email;
    console.log(`User authenticated: ${socket.userName} (${socket.userId})`);
    next();
  } catch (error) {
    console.log('Token verification failed:', error.message);
    return next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log(`User ${socket.userName} connected`);

  // Join general room
  socket.join('general');

  // Handle new message
  socket.on('send_message', async (data) => {
    try {
      const { message } = data;
      console.log(`Message received from ${socket.userName}: ${message}`);

      // Save to database
      const newMessage = await prisma.chatMessage.create({
        data: {
          message: message.trim(),
          userId: socket.userId,
          groupId: 'general'
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          }
        }
      });

      console.log(`Message saved to database: ${newMessage.id}`);

      // Broadcast to all users in general room
      io.to('general').emit('new_message', {
        id: newMessage.id,
        message: newMessage.message,
        userId: newMessage.userId,
        userName: newMessage.user.name,
        userEmail: newMessage.user.email,
        userImage: newMessage.user.image,
        createdAt: newMessage.createdAt,
        updatedAt: newMessage.updatedAt
      });

      console.log(`Message broadcasted to all users`);
    } catch (error) {
      console.error('Error saving message:', error);
      socket.emit('error', 'Failed to send message');
    }
  });

  // Handle edit message
  socket.on('edit_message', async (data) => {
    try {
      const { messageId, message } = data;

      // Check if message exists and user owns it
      const existingMessage = await prisma.chatMessage.findUnique({
        where: { id: messageId },
        include: { user: true }
      });

      if (!existingMessage || existingMessage.userId !== socket.userId) {
        socket.emit('error', 'Not authorized to edit this message');
        return;
      }

      // Update message
      const updatedMessage = await prisma.chatMessage.update({
        where: { id: messageId },
        data: {
          message: message.trim(),
          updatedAt: new Date()
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          }
        }
      });

      // Broadcast update to all users
      io.to('general').emit('message_updated', {
        id: updatedMessage.id,
        message: updatedMessage.message,
        userId: updatedMessage.userId,
        userName: updatedMessage.user.name,
        userEmail: updatedMessage.user.email,
        userImage: updatedMessage.user.image,
        createdAt: updatedMessage.createdAt,
        updatedAt: updatedMessage.updatedAt
      });
    } catch (error) {
      console.error('Error updating message:', error);
      socket.emit('error', 'Failed to update message');
    }
  });

  // Handle delete message
  socket.on('delete_message', async (data) => {
    try {
      const { messageId } = data;

      // Check if message exists and user owns it
      const existingMessage = await prisma.chatMessage.findUnique({
        where: { id: messageId },
        include: { user: true }
      });

      if (!existingMessage || existingMessage.userId !== socket.userId) {
        socket.emit('error', 'Not authorized to delete this message');
        return;
      }

      // Delete message
      await prisma.chatMessage.delete({
        where: { id: messageId }
      });

      // Broadcast deletion to all users
      io.to('general').emit('message_deleted', { messageId });
    } catch (error) {
      console.error('Error deleting message:', error);
      socket.emit('error', 'Failed to delete message');
    }
  });

  // Handle typing indicator
  socket.on('typing_start', () => {
    socket.to('general').emit('user_typing', {
      userId: socket.userId,
      userName: socket.userName
    });
  });

  socket.on('typing_stop', () => {
    socket.to('general').emit('user_stopped_typing', {
      userId: socket.userId
    });
  });

  socket.on('disconnect', () => {
    console.log(`User ${socket.userName} disconnected`);
  });
});

console.log('Socket.IO server running on port 3001'); 