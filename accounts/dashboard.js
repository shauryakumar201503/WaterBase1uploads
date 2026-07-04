// -------------------------------------------
// DASHBOARD BUTTONS PAGE
// -------------------------------------------

if (window.location.pathname.includes("dashboardbuttons.html")) {

    // Show welcome text
    const user = localStorage.getItem("loggedInUser");

    if (!user) {
        alert("You must login first.");
        window.location.href = "login.html";
    } else {
        document.getElementById("welcomeText").innerText = "Welcome, " + user;
    }

    // Upload File
    document.getElementById("uploadBtn").onclick = function () {
        window.location.href = "/upload"; // server.js handles this
    };

    // Create Website
    document.getElementById("createWebsiteBtn").onclick = function () {
        window.location.href = "/create-website"; // server.js handles this
    };

    // View Websites
    document.getElementById("viewWebsitesBtn").onclick = function () {
        window.location.href = "/view-websites"; // server.js handles this
    };

    // View Files
    document.getElementById("viewFilesBtn").onclick = function () {
        window.location.href = "/view-files"; // server.js handles this
    };

    // Other Dashboard
    document.getElementById("othersBtn").onclick = function () {
        window.location.href = "dashboardothers.html";
    };

    // Logout
    document.getElementById("logoutBtn").onclick = function () {
        localStorage.removeItem("loggedInUser");
        alert("Logged out successfully.");
        window.location.href = "frontpage.html";
    };
}



// -------------------------------------------
// DASHBOARD OTHER INFO PAGE
// -------------------------------------------

if (window.location.pathname.includes("dashboardothers.html")) {

    const user = localStorage.getItem("loggedInUser");

    if (!user) {
        alert("You must login first.");
        window.location.href = "login.html";
    }

    // Load user info from backend.js
    async function loadUserInfo() {
        const response = await fetch("/dashboard-info", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: user })
        });

        const data = await response.json();

        document.getElementById("usernameInfo").innerText = data.username;
        document.getElementById("gmailInfo").innerText = data.gmail;
        document.getElementById("uploadCount").innerText = data.uploads;
        document.getElementById("websiteCount").innerText = data.websites;
        document.getElementById("storageUsed").innerText = data.storage;
    }

    loadUserInfo();

    // Back button
    document.getElementById("backBtn").onclick = function () {
        window.location.href = "dashboardbuttons.html";
    };
}
