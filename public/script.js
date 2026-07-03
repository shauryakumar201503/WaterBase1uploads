// ----------------------
// UPLOAD SYSTEM (FINAL)
// ----------------------
function uploadFile() {
  const file = document.getElementById("fileInput").files[0];
  const password = document.getElementById("passwordInput").value;
  const username = document.getElementById("usernameInput").value;

  if (!file) {
    document.getElementById("result").innerHTML = "Please select a file.";
    return;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("password", password);
  formData.append("username", username);

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


// ----------------------
// UNLOCK SYSTEM (FINAL)
// ----------------------
function unlock() {
  const password = document.getElementById("unlockPass").value;

  // Extract ID from URL: /file/<id>/<filename>/<username>/<uploadNumber>/developershauryakumar
  const parts = window.location.pathname.split("/");
  const id = parts[2];

  fetch("/unlock/" + id, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      document.getElementById("msg").innerHTML = "Unlocked! Redirecting...";
      setTimeout(() => {
        window.location.href = "/download/" + id;
      }, 800);
    } else {
      document.getElementById("msg").innerHTML = data.message;
    }
  });
}


// ----------------------
// DOWNLOAD PAGE SUPPORT
// ----------------------
window.onload = () => {
  if (window.location.pathname.startsWith("/download/")) {
    const id = window.location.pathname.split("/")[2];
    document.getElementById("downloadBtn").onclick = () => {
      window.location.href = "/download/" + id;
    };
  }
};
