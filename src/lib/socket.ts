import { Server as HTTPServer } from "http"
import { Server as SocketIOServer } from "socket.io"
import { getServerSession } from "next-auth"
import { authOptions } from "./auth"

let io: SocketIOServer | null = null

export function initSocket(server: HTTPServer) {
  if (io) {
    return io
  }

  io = new SocketIOServer(server, {
    path: "/api/socket",
    addTrailingSlash: false,
  })

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id)

    // Join conversation room
    socket.on("join-conversation", (conversationId: string) => {
      socket.join(`conversation:${conversationId}`)
      console.log(`Socket ${socket.id} joined conversation:${conversationId}`)
    })

    // Leave conversation room
    socket.on("leave-conversation", (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`)
      console.log(`Socket ${socket.id} left conversation:${conversationId}`)
    })

    // Handle typing indicators
    socket.on("typing", ({ conversationId, userId, isTyping }) => {
      socket.to(`conversation:${conversationId}`).emit("user-typing", {
        userId,
        isTyping,
      })
    })

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id)
    })
  })

  return io
}

export function getIO(): SocketIOServer {
  if (!io) {
    throw new Error("Socket.io not initialized")
  }
  return io
}