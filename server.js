import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import session from "express-session";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production", // HTTPS in produzione
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 giorni
    }
}));

app.use(express.static(path.join(process.cwd(), ".")));
app.use(express.json());
app.use(cors({
    origin: process.env.BASE_URL,
    credentials: true // necessario per mandare i cookie di sessione
}));

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);

// ---- Middleware: controlla se l'utente è loggato ----
function requireAuth(req, res, next) {
    if (!req.session.user) {
        return res.status(401).json({ error: "Non autenticato" });
    }
    next();
}

// ---- Routes statiche ----
app.get("/", (req, res) => {
    res.sendFile(path.join(process.cwd(), "html", "index.html"));
});

// ---- Google OAuth ----
app.get("/auth/google", (req, res) => {
    const url =
        "https://accounts.google.com/o/oauth2/v2/auth" +
        `?client_id=${process.env.GOOGLE_CLIENT_ID}` +
        `&redirect_uri=${process.env.BASE_URL}/auth/google/callback` +
        "&response_type=code" +
        "&scope=openid%20profile%20email";
    res.redirect(url);
});

app.get("/auth/google/callback", async (req, res) => {
    try {
        const code = req.query.code;

        const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: `${process.env.BASE_URL}/auth/google/callback`,
                grant_type: "authorization_code",
            }),
        });

        const tokenData = await tokenRes.json();

        if (!tokenData.access_token) {
            return res.status(400).send("Errore OAuth: token non ricevuto");
        }

        const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });

        const user = await userRes.json();

        await syncUserToSupabase(user.id, user.email, user.name);

        req.session.user = user;

        res.redirect(process.env.BASE_URL);
    } catch (err) {
        console.error("Errore callback OAuth:", err);
        res.status(500).send("Errore durante il login");
    }
});

app.get("/auth/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect(process.env.BASE_URL);
    });
});

app.get("/api/user", (req, res) => {
    res.json(req.session.user ?? null);
});

// ---- Supabase sync ----
async function syncUserToSupabase(googleId, email, name) {
    const { error } = await supabase
        .from("site_users")
        .upsert(
            { google_id: googleId, email, display_name: name },
            { onConflict: "google_id" }
        );

    if (error) console.error("Errore sync utente:", error);
}

// ---- Upload nota ----
app.post("/upload/note", requireAuth, async (req, res) => {
    const { fileName, fileUrl, thumbnailUrl } = req.body;

    if (!fileName || !fileUrl) {
        return res.status(400).json({ error: "fileName e fileUrl sono obbligatori" });
    }

    const { error } = await supabase
        .from("notes")
        .insert({
            author_id: req.session.user.id,
            title: fileName,
            content: fileUrl,
            thumbnail: thumbnailUrl
        });

    if (error) {
        console.error("Errore salvataggio nota:", error);
        return res.status(500).json({ error: "Errore salvataggio nota" });
    }

    res.status(200).json({ message: "Nota caricata con successo" });
});

// ---- Upload evento ----
app.post("/upload/event", requireAuth, async (req, res) => {
    const { eventName, eventDescription, fileUrl, thumbnailUrl } = req.body;

    if (!eventName || !fileUrl) {
        return res.status(400).json({ error: "eventName e fileUrl sono obbligatori" });
    }

    console.log(req.body);

    const { error } = await supabase
        .from("events")
        .insert({
            author_id: req.session.user.id,
            title: eventName,
            content: eventDescription,
            image: fileUrl,
            thumbnail: thumbnailUrl
        });

    if (error) {
        console.error("Errore salvataggio evento:", error);
        return res.status(500).json({ error: "Errore salvataggio evento" });
    }

    res.status(200).json({ message: "Evento caricato con successo" });
});

// ---- Upload tutor ----
app.post("/upload/tutor", requireAuth, async (req, res) => {
    const { tutorName, tutorSurname, tutorEmail, tutorDescription, fileUrl, thumbnailUrl } = req.body;

    if (!tutorName || !fileUrl) {
        return res.status(400).json({ error: "tutorName e fileUrl sono obbligatori" });
    }

    const { error } = await supabase
        .from("tutors")
        .insert({
            author_id: req.session.user.id,
            name: tutorName,
            surname: tutorSurname,
            email: tutorEmail,
            description: tutorDescription,
            content: fileUrl,
            thumbnail: thumbnailUrl
        });

    if (error) {
        console.error("Errore salvataggio nota:", error);
        return res.status(500).json({ error: "Errore salvataggio nota" });
    }

    res.status(200).json({ message: "Tutor caricato con successo" });
});

// ---- Get tutte le note ----
app.get("/get/notes", async (req, res) => {
    const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Errore fetch note:", error);
        return res.status(500).json({ error: "Errore interno" });
    }

    res.json(data);
});

// ---- Get tutte gli eventi ----
app.get("/get/events", async (req, res) => {
    const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Errore fetch note:", error);
        return res.status(500).json({ error: "Errore interno" });
    }

    res.json(data);
});

// ---- Get tutte i tutor ----
app.get("/get/tutors", async (req, res) => {
    const { data, error } = await supabase
        .from("tutors")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Errore fetch note:", error);
        return res.status(500).json({ error: "Errore interno" });
    }

    res.json(data);
});

// ---- Get note dell'utente loggato ----
app.get("/get/user/notes", requireAuth, async (req, res) => {
    const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("author_id", req.session.user.id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Errore fetch note utente:", error);
        return res.status(500).json({ error: "Errore interno" });
    }

    res.json(data);
});

// ---- Get eventi dell'utente loggato ----
app.get("/get/user/events", requireAuth, async (req, res) => {
    const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("author_id", req.session.user.id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Errore fetch note utente:", error);
        return res.status(500).json({ error: "Errore interno" });
    }

    res.json(data);
});

// ---- Get eventi dell'utente loggato ----
app.get("/get/user/tutors", requireAuth, async (req, res) => {
    const { data, error } = await supabase
        .from("tutors")
        .select("*")
        .eq("author_id", req.session.user.id)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Errore fetch note utente:", error);
        return res.status(500).json({ error: "Errore interno" });
    }

    res.json(data);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});