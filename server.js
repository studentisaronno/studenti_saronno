import express from "express";
import multer from "multer";
import cors from "cors";
import { Storage } from "megajs";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.static(".")); // serve index.html e altri file statici

// Cartella temporanea per file grandi
const tempDir = path.join(process.cwd(), "tmp");
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

// multer con salvataggio su disco temporaneo
const upload = multer({ dest: tempDir });

// Connetti a MEGA (usa variabili ambiente per sicurezza!)
const storage = await new Storage({
    email: 'studentisaronno@gmail.com',
    password: 'Studenti_Saronno2026!'
}).ready;

console.log("Connesso a MEGA");

// Endpoint upload
app.post("/upload", upload.single("file"), async (req, res) => {
    try {
        console.log("Ricevuto file:", req.file.originalname, req.file.size);

        // Stream dal file temporaneo
        const filePath = req.file.path;
        const stats = fs.statSync(filePath);
        const stream = fs.createReadStream(filePath);

        // Upload su MEGA
        const file = await storage.upload({
            name: req.file.originalname,
            size: stats.size
        }, stream).complete;

        console.log("Upload completato:", file.link());

        // Cancella file temporaneo
        fs.unlinkSync(filePath);

        res.json({
            success: true,
            link: file.link()
        });

    } catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({ success: false });
    }
});

// Avvia server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
});
