// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

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
auth.languageCode = 'en'; // Set language code

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

            alert(`Welcome, ${user.displayName}! Email: ${user.email}`);
        })
        .catch((error) => {
            // Handle Errors here
            console.error("Sign-In Error", error);
            alert("Google Sign-In failed. Please try again.");
        });
});

// Check if user is signed in before submitting the form
document.querySelector("form").addEventListener("submit", (event) => {
    const user = auth.currentUser;

    if (!user) {
        event.preventDefault(); // Prevent form submission
        alert("You must be signed in to submit the form!");
        return;
    }

    alert(`Form submitted by: ${user.displayName} (${user.email})`);
});

// Update user profile display (if needed)
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
document.getElementById("login-btn").addEventListener("click", function () {
    // Simulate a login (replace with actual authentication logic)
    const email = document.getElementById("email").value;

    if (email) {
        // Save login state and user data
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);

        // Redirect to the profile page
        window.location.href = "profile.html";
    } else {
        alert("Please enter your email to log in.");
    }
});
