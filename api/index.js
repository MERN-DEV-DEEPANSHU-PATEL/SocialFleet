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
import multer from "multer";
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
  res.send({ msg: "Done bro" });
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true })); //
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), async (req, res) => {
  const file = req.file;
  const imageMetadata = await uploadImageToCDN(req.file);
  res.status(200).json(imageMetadata.name);
});

///////////////////////////// USER STORIES FILE HANDLING BEGINS

const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload2 = multer({ storage: storage2 });

app.post("/api/stories", (req, res) => {
  const authHeaders = req.headers.authorization;
  const token = authHeaders.split(" ")[1];
  if (!token) return res.status(401).json("Not logged in!");
  jwt.verify(token, "secretkey", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const q =
      "INSERT INTO stories (`media`, `username`,`createdAt`) VALUES (?, ?, ?)";
    const values = [req.body.urlName, userInfo.username, moment().toDate()];

    db.query(q, values, (err, data) => {
      if (err) {
        console.error("Error adding post:", err);
        return res.status(500).json(err);
      }
      return res.status(200).json("Story has been created.");
    });
  });
});
///////////////////////////// USER STORIES FILE HANDLING ENDS

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
});

// Starting Server.....
const port = process.env.PORT | 8800;
app.listen(port, () => {
  console.log("Server Started API working!");
});

setInterval(() => {
  deleteOldStories();
}, 1000 * 60 * 60 * 24);
