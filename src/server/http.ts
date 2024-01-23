import express from "express";

const app = express();

app.get("/", (_, res) => {
  res.send("Hello, World! I'm a server!");
});

app.listen(5000, () => {
  console.log("HTTP Server Running");
});
