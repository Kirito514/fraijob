import { NextResponse } from 'next/server';
import { Server as SocketIOServer } from 'socket.io';
import { verifyToken } from '@/lib/auth';

let io;

if (!global.io) {
  io = new SocketIOServer(3001, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = verifyToken(token);
      if (!decoded) {
        return next(new Error('Invalid token'));
      }
      socket.userId = decoded.id;
      socket.userName = decoded.name || decoded.email;
      next();
    } catch (error) {
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
        
        // Save to database
        const { prisma } = await import('@/lib/prisma');
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
      } catch (error) {
        console.error('Error saving message:', error);
        socket.emit('error', 'Failed to send message');
      }
    });

    // Handle edit message
    socket.on('edit_message', async (data) => {
      try {
        const { messageId, message } = data;
        
        const { prisma } = await import('@/lib/prisma');
        
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
        
        const { prisma } = await import('@/lib/prisma');
        
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

  global.io = io;
} else {
  io = global.io;
}

export async function GET() {
  return NextResponse.json({ message: 'Socket.IO server is running' });
} 