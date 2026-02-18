import express from "express";
import path from "path";

const app = express();
app.use(express.static(".")); // serve index.html e altri file statici


// Avvia server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server avviato su http://localhost:${PORT}`);
});
