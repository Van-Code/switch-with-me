const { createServer } = require("http")
const { parse } = require("url")
const next = require("next")
const { Server } = require("socket.io")

const dev = process.env.NODE_ENV !== "production"
const hostname = "localhost"
const port = 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error("Error occurred handling", req.url, err)
      res.statusCode = 500
      res.end("internal server error")
    }
  })

  const io = new Server(server, {
    path: "/api/socket",
    addTrailingSlash: false,
  })

  // Store io instance globally
  global.io = io

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id)

    socket.on("join-conversation", (conversationId) => {
      socket.join(`conversation:${conversationId}`)
      console.log(`Socket ${socket.id} joined conversation:${conversationId}`)
    })

    socket.on("leave-conversation", (conversationId) => {
      socket.leave(`conversation:${conversationId}`)
      console.log(`Socket ${socket.id} left conversation:${conversationId}`)
    })

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

  server
    .once("error", (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
})