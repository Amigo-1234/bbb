// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC9wkWxQbbKzTDSywioxDyqFct9mlOwi30",
    authDomain: "boma-917e7.firebaseapp.com",
    projectId: "boma-917e7",
    storageBucket: "boma-917e7.appspot.com",
    messagingSenderId: "558465443135",
    appId: "1:558465443135:web:285382557e61dd2cf41f8a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'en'; // Set language code (can change to 'it' or others)

// Google Provider
const provider = new GoogleAuthProvider();

// Handle Google Sign-In button
document.getElementById("google").addEventListener("click", () => {
    signInWithPopup(auth, provider)
        .then((result) => {
            // Get Google Access Token
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // Get signed-in user info
            const user = result.user;
           window.location.href = "profile.html"
            // Display a success message
            alert(`Welcome, ${user.displayName}! Email: ${user.email}`);
        })
        .catch((error) => {
            // Handle Errors here
            const errorCode = error.code;
            const errorMessage = error.message;
            // Log errors
            console.error("Error Code:", errorCode);
            console.error("Error Message:", errorMessage);
            console.error("Email:", email);
            console.error("Credential:", credential);

            // Display an error message
            alert("Google Sign-In failed. Please try again.");
        });
});
function updateUserProfile(user) {
    if (!user) {
        console.error("No user object provided!");
        return;
    }

    // Extract user details
    const userName = user.displayName || "Anonymous";
    const userEmail = user.email || "Email not available";
    const userProfilePicture = user.photoURL || "default-profile.png"; // Fallback to a default image

    // Update the DOM with user data
    document.getElementById("userName").textContent = userName;
    document.getElementById("userEmail").textContent = userEmail;
    document.getElementById("userProfilePicture").src = userProfilePicture;
}
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

const auth = getAuth();

document.getElementById("signOut").addEventListener("click", (e) => {
    e.preventDefault(); // Prevent default link behavior
    signOut(auth)
        .then(() => {
            // Redirect the user to the sign-in page
            alert("You have signed out successfully.");
            window.location.href = "signin.html"; // Change this to your sign-in page URL
        })
        .catch((error) => {
            console.error("Error signing out:", error);
            alert("An error occurred while signing out. Please try again.");
        });
});
window.addEventListener("load", function () {
    // Check if the user is logged in
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
        // If not logged in, redirect to the login page
        alert("You must log in to view your profile.");
        window.location.href = "signin.html";
    } else {
        // Load user data (example)
        const userEmail = localStorage.getItem("userEmail");
        document.getElementById("profile-email").textContent = userEmail || "No email found";
    }
});
window.addEventListener("load", function () {
    // Check if the user is logged in by checking the 'isLoggedIn' flag
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
        // If not logged in, redirect to login page
        alert("You must log in to view your profile.");
        window.location.href = "signin.html";
    } else {
        // If logged in, display user profile
        const userEmail = localStorage.getItem("userEmail");
        document.getElementById("profile-email").textContent = userEmail || "No email found";
    }
});

