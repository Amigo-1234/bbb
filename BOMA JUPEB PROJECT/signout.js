document.getElementById("signout-btn").addEventListener("click", function () {
    const confirmation = confirm("Are you sure you want to sign out?");
    
    if (confirmation) {
        // Clear all user-related data from localStorage/sessionStorage
        localStorage.removeItem("isLoggedIn"); 
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userProfile");

        // Optionally, you can also clear sessionStorage if used
        sessionStorage.clear();

        // Redirect to login page after signing out
        window.location.href = "signin.html";
    }
});
