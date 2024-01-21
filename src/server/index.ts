import { WebSocketServer } from "ws";

const { WS_PORT: PORT } = process.env;

const server = new WebSocketServer({
  port: PORT ? +PORT : 8080,
});

server.on("listening", () => {
  console.log("WS Socket Server up and running...");
});

server.on("connection", (ws) => {
  ws.on("error", console.error);
  ws.on("message", (data) => {
    console.log(`Received: ${data}`);
  });
  ws.send("Hello, Stranger!");
});
