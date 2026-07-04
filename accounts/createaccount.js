document.getElementById("nextBtn").onclick = function () {

    const gmail = document.getElementById("gmailInput").value.trim();
    const username = document.getElementById("usernameInput").value.trim();
    const password = document.getElementById("passwordInput").value.trim();

    if (!gmail || !username || !password) {
        alert("Please fill all fields.");
        return;
    }

    // Save data temporarily for verification page
    localStorage.setItem("temp_gmail", gmail);
    localStorage.setItem("temp_username", username);
    localStorage.setItem("temp_password", password);

    // Move to verification page
    window.location.href = "verification.html";
};
