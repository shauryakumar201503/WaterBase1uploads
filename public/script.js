function uploadFile() {
  const file = document.getElementById("fileInput").files[0];
  const password = document.getElementById("passwordInput").value;
  const username = document.getElementById("usernameInput").value;
  const siteName = document.getElementById("siteNameInput").value;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("password", password);
  formData.append("username", username);
  formData.append("siteName", siteName);

  fetch("/upload", {
    method: "POST",
    body: formData
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      document.getElementById("result").innerHTML =
        "Your special URL:<br>" + window.location.origin + data.url;
    } else {
      document.getElementById("result").innerHTML = data.message;
    }
  });
}

function unlock() {
  const password = document.getElementById("unlockPass").value;

  const parts = window.location.pathname.split("/");
  const filename = parts[2];
  const username = parts[3];
  const uploadNumber = parts[4];

  const data = JSON.parse(localStorage.getItem("waterbaseData") || "{}");

  const id = Object.keys(data).find(key => {
    return data[key].filename === filename &&
           data[key].username === username &&
           data[key].uploadNumber.toString() === uploadNumber;
  });

  fetch("/unlock/" + id, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      window.location.href = "/download/" + id;
    } else {
      document.getElementById("msg").innerHTML = data.message;
    }
  });
}

window.onload = () => {
  if (window.location.pathname.startsWith("/download/")) {
    const id = window.location.pathname.split("/")[2];
    document.getElementById("downloadBtn").onclick = () => {
      window.location.href = "/download/" + id;
    };
  }
};
