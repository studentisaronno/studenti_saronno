import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import path from "path";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";
import session from "express-session";

dotenv.config();

const app = express();
app.use(session({
  secret: `${process.env.SESSION_SECRET}`,
  resave: false,
  saveUninitialized: false
}));
app.use(express.static(path.join(process.cwd(), ".")));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(path.join(process.cwd(), "html", "index.html"));
});

app.get("/auth/google", (req, res) => {
  const url =
    "https://accounts.google.com/o/oauth2/v2/auth" +
    `?client_id=${process.env.GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${process.env.BASE_URL}/auth/google/callback` +
    "&response_type=code" +
    "&scope=openid%20profile%20email";

  res.redirect(url);
});

let currentUser = null;

app.get("/auth/google/callback", async (req, res) => {
  const code = req.query.code;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code: code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.BASE_URL}/auth/google/callback`,
      grant_type: "authorization_code",
    }),
  });

  const tokenData = await tokenRes.json();

  const accessToken = tokenData.access_token;

  const userRes = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const user = await userRes.json();

  req.session.user = user;

  res.redirect(process.env.BASE_URL);
});

app.get("/api/user", (req, res) => {
  console.log(req.session.user);
  if (!req.session.user) {
    return res.json(null);
  }
  res.json(req.session.user);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});