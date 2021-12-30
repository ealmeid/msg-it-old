const app = require("express")();
const http = require("http").createServer(app);
const cors = require("cors");
const PORT = process.env.PORT || 5000;

app.use(cors());

app.get("/", (req: any, res: any) => {
  res.send("Server is up and running");
});

http.listen(PORT, () => {
  console.log(`Listening to ${PORT}`);
});
