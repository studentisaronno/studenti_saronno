import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import path from "path";
import axios from "axios";
import FormData from "form-data";

const app = express();
app.use(cors());
app.use(express.static("."));

const upload = multer({ dest: "tmp/" });

// Inserisci qui i tuoi dati (o usa le variabili d'ambiente su Koyeb)
// const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || 'IL_TUO_TOKEN';
// const CHAT_ID = process.env.TELEGRAM_CHAT_ID || 'IL_TUO_CHAT_ID';

const TELEGRAM_TOKEN = "8559429495:AAGokqZ2tvjfyVXN2AfY-CS6FRqc5eiD038";
const CHAT_ID = "-1003706968065";

// 1. Endpoint per caricare il file su Telegram
app.post("/upload", upload.single("file"), async (req, res) => {
    try {
        const filePath = req.file.path;
        const form = new FormData();
        
        form.append('chat_id', CHAT_ID);
        form.append('document', fs.createReadStream(filePath), {
            filename: req.file.originalname,
        });

        form.append('caption', `Appunto caricato: ${req.file.originalname}`);

        const response = await axios.post(
            `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendDocument`,
            form,
            { headers: form.getHeaders() }
        );

        fs.unlinkSync(filePath); // Elimina file temporaneo

        res.json({ 
            success: true, 
            file_id: response.data.result.document.file_id,
            message_id: response.data.result.message_id 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

// 2. Endpoint per eliminare il file (messaggio)
app.delete("/delete/:messageId", async (req, res) => {
    try {
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/deleteMessage`, {
            chat_id: CHAT_ID,
            message_id: req.params.messageId
        });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

app.listen(process.env.PORT || 8000);