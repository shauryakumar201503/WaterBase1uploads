const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const router = express.Router();
router.use(bodyParser.json());

// Paths
const usersFile = path.join(__dirname, "users.json");
const websitesFile = path.join(__dirname, "websites.json");
const dataFile = path.join(__dirname, "data.json");

// ---------- Helpers ----------
function safeReadJSON(filePath, defaultValue = []) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
    }
    const data = fs.readFileSync(filePath, "utf8");
    try {
        return JSON.parse(data || JSON.stringify(defaultValue));
    } catch {
        return defaultValue;
    }
}

function readUsers() {
    return safeReadJSON(usersFile, []);
}

function writeUsers(users) {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

function readWebsites() {
    return safeReadJSON(websitesFile, []);
}

function readData() {
    return safeReadJSON(dataFile, []);
}

// ---------- Email (App Password) ----------
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "RoboverseEntertainment@gmail.com",
        pass: "nzjl ztxm eike ilvp"
    }
});

// ---------- POST /create-account-final ----------
router.post("/create-account-final", (req, res) => {
    const { gmail, username, password } = req.body;

    let users = readUsers();

    if (users.some(u => u.username === username)) {
        return res.json({ success: false, message: "Username already taken." });
    }

    const verificationCode = String(Math.floor(10000 + Math.random() * 90000));

    const newUser = {
        username,
        password,
        gmail,
        verificationCode,
        verified: false,
        loggedIn: false
    };

    users.push(newUser);
    writeUsers(users);

    const mailOptions = {
        from: "roboverseentertainment@gmail.com",
        to: gmail,
        subject: "Your WaterBase Verification Code",
        text: `Your 5-digit verification code is: ${verificationCode}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Email error:", error);
            return res.json({ success: false, message: "Could not send email." });
        } else {
            console.log("Email sent:", info.response);
            return res.json({ success: true });
        }
    });
});

// ---------- POST /verify-code ----------
router.post("/verify-code", (req, res) => {
    const { gmail, code } = req.body;

    const users = readUsers();
    const user = users.find(u => u.gmail === gmail);

    if (!user) {
        return res.json({ success: false, message: "User not found." });
    }

    if (user.verificationCode === code) {
        user.verified = true;
        writeUsers(users);
        return res.json({ success: true });
    } else {
        return res.json({ success: false, message: "Incorrect code." });
    }
});

// ---------- POST /login ----------
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    const users = readUsers();
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.json({ success: false, message: "Invalid credentials." });
    }

    if (!user.verified) {
        return res.json({ success: false, message: "Account not verified." });
    }

    user.loggedIn = true;
    writeUsers(users);

    res.json({ success: true });
});

// ---------- POST /dashboard-info ----------
router.post("/dashboard-info", (req, res) => {
    const { username } = req.body;

    const users = readUsers();
    const user = users.find(u => u.username === username);

    if (!user) {
        return res.json({ success: false, message: "User not found." });
    }

    const allWebsites = readWebsites();
    const allData = readData();

    const userWebsites = allWebsites.filter(w => w.username === username);
    const userUploads = allData.filter(d => d.username === username);

    const info = {
        username: user.username,
        gmail: user.gmail,
        uploads: userUploads.length,
        websites: userWebsites.length,
        storage: `${userUploads.length * 5} MB`
    };

    res.json(info);
});

module.exports = router;
