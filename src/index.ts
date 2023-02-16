import express from "express";
import cors from "cors";
import dayjs from "dayjs";
import morgan from "morgan";
const app = express();

const originWhitelist = [
  "http://localhost:5173",
  "https://dev-testnet-nordl.netlify.app/",
];

const corsOptions = {
  origin: originWhitelist,
  credentials: true,
};

app.use(morgan("dev"));

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello Express app!");
});

app.get("/say-hello", (req, res) => {
  res.status(200).json({ success: true, message: "hello" });
});

app.post("/login", (req, res) => {
  if (req.body?.username !== undefined && req.body?.password !== undefined) {
    if (req.body.username === "test" && req.body.password === "test123") {
      const userAndTimeStamp = `user:test serverLoginTime: ${new Date().toString()}`;

      const data = {
        user: "test",
        serverLoginTime: new Date().toString(),
      };

      res
        .status(201)
        .cookie("accessToken", JSON.stringify(userAndTimeStamp), {
          domain: "localhost",
          path: "/",
          secure: false,
          httpOnly: true,
          sameSite: "lax",
          expires: dayjs().add(1, "hours").toDate(),
          encode: String,
        })
        .json({ success: true, message: "test user logged in!", data });
    } else {
      res
        .status(401)
        .json({ success: false, message: "incorrect credentials" });
    }
  } else {
    res
      .status(400)
      .json({ success: false, message: "username or password not found" });
  }
});

app.listen(8080, () => {
  console.log("server started on port 8080");
});
