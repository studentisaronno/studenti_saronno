import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import path from "path";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";

const app = express();
app.use(express.static(path.join(process.cwd(), ".")));
app.use(express.json());
app.use(cors());

const CLIENT_ID = "Ov23ctS7K1fS1qxjnZkK";
const SECRET_CLIENT_ID = "4b6f7d8e1cb961e2283e98566f5dedf3aef531cd";
const BASE_URL = "https://studentisaronno.it";

app.get("/", (req, res) => {
    res.sendFile(path.join(process.cwd(), "html", "index.html"));
});

// redirect to GitHub
app.get("/auth/github", (req, res) => {
    const redirect =
        "https://github.com/login/oauth/authorize" +
        `?client_id=${CLIENT_ID}` +
        `&redirect_uri=${BASE_URL}/auth/github/callback` +
        "&scope=user";

    res.redirect(redirect);
});

// callback
app.get("/auth/github/callback", async (req, res) => {
    const code = req.query.code;
    console.log("Received code:", code);
    try {
        // exchange code → access token
        const tokenResponse = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
                client_id: CLIENT_ID,
                client_secret: SECRET_CLIENT_ID,
                code: code,
            },
            {
                headers: { Accept: "application/json" },
            },
        );

        const accessToken = tokenResponse.data.access_token;

        // get user data
        const userResponse = await axios.get("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const user = userResponse.data;

        res.send(`
      <h1>Login successful</h1>
      <img src="${user.avatar_url}" width="100"/>
      <p>ID: ${user.id}</p>
      <p>Username: ${user.login}</p>
    `);
    } catch (err) {
        res.status(500).send("OAuth error");
    }
});

// const upload = multer({ dest: "tmp/" });

// // Inserisci qui i tuoi dati (o usa le variabili d'ambiente su Koyeb)
// // const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || 'IL_TUO_TOKEN';
// // const CHAT_ID = process.env.TELEGRAM_CHAT_ID || 'IL_TUO_CHAT_ID';

// const TELEGRAM_TOKEN = "8559429495:AAGokqZ2tvjfyVXN2AfY-CS6FRqc5eiD038";
// const CHAT_ID = "-1003706968065";

// // 1. Endpoint per caricare il file su Telegram
// app.post("/upload", upload.single("file"), async (req, res) => {
//     try {
//         const filePath = req.file.path;
//         const form = new FormData();

//         form.append("chat_id", CHAT_ID);
//         form.append("document", fs.createReadStream(filePath), {
//             filename: req.file.originalname,
//         });

//         form.append("caption", `Appunto caricato: ${req.file.originalname}`);

//         const response = await axios.post(
//             `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendDocument`,
//             form,
//             { headers: form.getHeaders() },
//         );

//         fs.unlinkSync(filePath); // Elimina file temporaneo

//         res.json({
//             success: true,
//             file_id: response.data.result.document.file_id,
//             message_id: response.data.result.message_id,
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ success: false });
//     }
// });

// // 2. Endpoint per eliminare il file (messaggio)
// app.delete("/delete/:messageId", async (req, res) => {
//     try {
//         await axios.post(
//             `https://api.telegram.org/bot${TELEGRAM_TOKEN}/deleteMessage`,
//             {
//                 chat_id: CHAT_ID,
//                 message_id: req.params.messageId,
//             },
//         );
//         res.json({ success: true });
//     } catch (err) {
//         res.status(500).json({ success: false });
//     }
// });

// app.get("/", (req, res) => {
//     res.sendFile(path.join(process.cwd(), "html", "index.html"));
// });

const PORT = process.env.PORT || 8000;
app.listen(PORT);
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server attivo su http://localhost:${PORT}`);
});
