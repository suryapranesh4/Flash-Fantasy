const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

//Connect To Database
const connectDB = require("./config/db");
connectDB();

//Init middleware
app.use(express.json({ extended: false }));

//CORS
app.use(cors());

//Define Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/matches", require("./routes/api/matches"));
app.use("/api/players", require("./routes/api/players"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/teams", require("./routes/api/teams"));

//Serve static assets in production
if (process.env.NODE_ENV === "production") {
  //set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Listening on PORT:", PORT);
});
