import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import friendsRoutes from "./routes/friends.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import storiesRoutes from "./routes/stories.js";
import relationshipRoutes from "./routes/relationships.js";
import jwt from "jsonwebtoken";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { deleteOldStories } from "./controllers/story.js";
import { db } from "./connect.js";
import { getSuggestions } from "./controllers/suggestions.js";
import moment from "moment";
import { getToken, uploadImageToCDN } from "./ImageKit.js";
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
//middlewares
app.get("/", (req, res) => {
  res.send({ msg: "Server Is Running" });
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true })); //
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/friends", friendsRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/stories", storiesRoutes);
app.use("/api/relationships", relationshipRoutes);
app.get("/api/suggestions", getSuggestions);
// app.get("/test", getRelationshipsWithData);
// To Check DataBase is connected or not

app.post("/api/generate-auth-token", async (req, res) => {
  const authenticationParameters = await getToken();
  res.json(authenticationParameters);
});

db.connect((err) => {
  if (err) {
    console.log("there is an error", err);
    console.log(err);
    return err;
  }
  console.log("Database Connected");
  // Starting Server.....
  const port = process.env.PORT | 8800;
  app.listen(port, () => {
    console.log("Server Started API working!");
  });
});

setInterval(() => {
  deleteOldStories();
}, 1000 * 60 * 60 * 24);
