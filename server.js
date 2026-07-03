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

const uploadFolder = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

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

const DATA_FILE = path.join(__dirname, "data.json");

function loadData() {
  return JSON.parse(fs.readFileSync(DATA_FILE));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.post("/upload", upload.single("file"), (req, res) => {
  const password = req.body.password;
  const username = req.body.username;
  const siteName = req.body.siteName;
  const file = req.file;

  if (!file || !password || !username || !siteName) {
    return res.json({ success: false, message: "Missing fields" });
  }

  const data = loadData();
  const id = Date.now().toString();
  const uploadNumber = Object.keys(data).length + 1;

  data[id] = {
    filename: file.filename,
    originalName: file.originalname,
    password: password,
    username: username,
    siteName: siteName,
    uploadNumber: uploadNumber,
    unlocked: false
  };

  saveData(data);

  const specialURL =
    `/file/${file.filename}/${username}/${uploadNumber}/developershauryakumar`;

  res.json({ success: true, url: specialURL });
});

app.get("/file/:filename/:username/:uploadNumber/developershauryakumar", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "unlock.html"));
});

app.post("/unlock/:id", (req, res) => {
  const id = req.params.id;
  const password = req.body.password;

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
  res.download(filePath, data[id].originalName);
});

app.listen(PORT, () => {
  console.log("WaterBase running on port " + PORT);
});
