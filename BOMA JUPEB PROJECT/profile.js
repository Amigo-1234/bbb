import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

const auth = getAuth();

onAuthStateChanged(auth, (user) => {
    if (user) {
        updateUserProfile(user);
    } else {
        alert("Please create an account and log in.");
        window.location.href = "signup.html";
    }
});

function updateUserProfile(user) {
    const userName = user.displayName || "Anonymous";
    const userEmail = user.email || "No email available";
    const userProfilePicture = user.photoURL || "default-profile.png";
    const userBio = user.bio || "No bio available";

    document.getElementById("userName").textContent = userName;
    document.getElementById("userEmail").textContent = userEmail;
    document.getElementById("userProfilePicture").src = userProfilePicture;
    document.getElementById("userBio").textContent = userBio;
    document.getElementById("userEmailDisplay").textContent = userEmail;
}

function editProfile() {
    // Implement profile editing functionality (redirect to an edit page, etc.)
    alert("Edit Profile functionality can be added here.");
}

