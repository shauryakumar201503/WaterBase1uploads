const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Use "download" folder for file storage
const uploadFolder = path.join(__dirname, "download");
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

// Multer storage system
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Data file
const DATA_FILE = path.join(__dirname, "data.json");

// Websites file
const WEBSITES_FILE = path.join(__dirname, "websites.json");

// Load and save data.json
function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, "{}");
  }
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Load and save websites.json
function loadWebsites() {
  if (!fs.existsSync(WEBSITES_FILE)) {
    fs.writeFileSync(WEBSITES_FILE, "[]");
  }
  return JSON.parse(fs.readFileSync(WEBSITES_FILE));
}

function saveWebsites(data) {
  fs.writeFileSync(WEBSITES_FILE, JSON.stringify(data, null, 2));
}

// UPLOAD ROUTE
app.post("/upload", upload.single("file"), (req, res) => {
  const { password, username } = req.body;
  const file = req.file;

  if (!file || !password || !username) {
    return res.json({ success: false, message: "Missing fields" });
  }

  const data = loadData();
  const id = Date.now().toString();
  const uploadNumber = Object.keys(data).length + 1;

  data[id] = {
    filename: file.filename,
    originalName: file.originalname,
    password,
    username,
    uploadNumber,
    unlocked: false
  };

  saveData(data);

  // FINAL URL FORMAT WITH ID INCLUDED
  const specialURL =
    `/file/${id}/${file.filename}/${username}/${uploadNumber}/developershauryakumar`;

  // ⭐ NEW FEATURE: SAVE WEBSITE NAME + URL IN websites.json
  const websites = loadWebsites();

  // Find user entry
  let userEntry = websites.find(u => u.Username === username);

  if (!userEntry) {
    // Create new user entry
    userEntry = {
      Username: username,
      urls: []
    };
    websites.push(userEntry);
  }

  // Add new website URL
  userEntry.urls.push(`waterbase1.com/${username}/${uploadNumber}`);

  // Save updated websites.json
  saveWebsites(websites);

  res.json({ success: true, url: specialURL });
});

// UNLOCK PAGE ROUTE
app.get("/file/:id/:filename/:username/:uploadNumber/developershauryakumar", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "unlock.html"));
});

// UNLOCK API
app.post("/unlock/:id", (req, res) => {
  const id = req.params.id;
  const { password } = req.body;

  const data = loadData();

  if (!data[id]) {
    return res.json({ success: false, message: "Invalid link" });
  }

  if (data[id].password === password) {
    data[id].unlocked = true;
    saveData(data);
    return res.json({ success: true });
  }

  res.json({ success: false, message: "Wrong password" });
});

// DOWNLOAD ROUTE
app.get("/download/:id", (req, res) => {
  const id = req.params.id;
  const data = loadData();

  if (!data[id]) {
    return res.send("Invalid link");
  }

  if (!data[id].unlocked) {
    return res.send("You must unlock the file first");
  }

  const filePath = path.join(uploadFolder, data[id].filename);

  if (!fs.existsSync(filePath)) {
    return res.send("File missing on server");
  }

  res.download(filePath, data[id].originalName);
});

// START SERVER
app.listen(PORT, () => {
  console.log("WaterBase running on port " + PORT);
});
