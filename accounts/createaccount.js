// -------------------------------
// STEP 1: CREATE ACCOUNT PAGE
// -------------------------------

if (window.location.pathname.includes("create.html")) {

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
}



// -------------------------------
// STEP 2: VERIFICATION PAGE
// -------------------------------

if (window.location.pathname.includes("verification.html")) {

    document.getElementById("prevBtn").onclick = function () {
        window.location.href = "create.html";
    };

    document.getElementById("nextBtn").onclick = async function () {

        const userCode = document.getElementById("codeInput").value.trim();

        if (userCode.length !== 5) {
            alert("Please enter the 5-digit code.");
            return;
        }

        // Send code + Gmail to backend.js for verification
        const gmail = localStorage.getItem("temp_gmail");

        const response = await fetch("/verify-code", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                gmail: gmail,
                code: userCode
            })
        });

        const result = await response.json();

        if (result.success) {
            window.location.href = "condition.html";
        } else {
            alert("Incorrect code. Please check your Gmail again.");
        }
    };
}



// -------------------------------
// STEP 3: CONDITION PAGE
// -------------------------------

if (window.location.pathname.includes("condition.html")) {

    document.getElementById("noBtn").onclick = function () {
        alert("You must agree to continue.");
    };

    document.getElementById("yesBtn").onclick = function () {
        alert("Thank you for agreeing.");
    };

    document.getElementById("finishBtn").onclick = async function () {

        const gmail = localStorage.getItem("temp_gmail");
        const username = localStorage.getItem("temp_username");
        const password = localStorage.getItem("temp_password");

        // Send final user data to backend.js
        const response = await fetch("/create-account-final", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                gmail: gmail,
                username: username,
                password: password
            })
        });

        const result = await response.json();

        if (result.success) {
            // Clear temporary data
            localStorage.removeItem("temp_gmail");
            localStorage.removeItem("temp_username");
            localStorage.removeItem("temp_password");

            // Go to login page
            window.location.href = "login.html";
        } else {
            alert("Error creating account. Try again.");
        }
    };
}
