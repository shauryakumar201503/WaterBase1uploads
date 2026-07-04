document.getElementById("backBtn").onclick = function () {
    window.location.href = "frontpage.html";
};

document.getElementById("loginBtn").onclick = async function () {

    const username = document.getElementById("usernameInput").value.trim();
    const password = document.getElementById("passwordInput").value.trim();

    if (!username || !password) {
        alert("Please fill all fields.");
        return;
    }

    // Send login data to backend.js
    const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: username,
            password: password
        })
    });

    const result = await response.json();

    if (result.success) {

        // Save logged-in user
        localStorage.setItem("loggedInUser", username);

        // Go to dashboard
        window.location.href = "dashboardbuttons.html";

    } else {
        alert("Incorrect username or password.");
    }
};
