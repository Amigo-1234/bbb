import { getAuth, updateProfile, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

const auth = getAuth();
const editProfileForm = document.getElementById("editProfileForm");
const profileImage = document.getElementById("profileImage");
const profileImagePreview = document.getElementById("profileImagePreview");

// Display current user data
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById("name").value = user.displayName || "";
        document.getElementById("email").value = user.email || "";
        profileImagePreview.src = user.photoURL || "default-profile.png";
    } else {
        alert("You need to log in to edit your profile.");
        window.location.href = "signin.html";
    }
});

// Preview profile image
profileImage.addEventListener("change", () => {
    const file = profileImage.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            profileImagePreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Update user profile
editProfileForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
        alert("User is not logged in.");
        return;
    }

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;

    updateProfile(user, {
        displayName: name,
        photoURL: profileImagePreview.src,
    })
    .then(() => {
        alert("Profile updated successfully!");
        window.location.href = "profile.html"; // Redirect to profile page
    })
    .catch((error) => {
        console.error("Error updating profile:", error);
        alert("Failed to update profile. Please try again.");
    });
});
