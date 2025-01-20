    import { getAuth, updateProfile, updateEmail } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
    import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

    const auth = getAuth();
    const db = getFirestore();

    const editProfileForm = document.getElementById('editProfileForm');

    auth.onAuthStateChanged(async (user) => {
        if (user) {
            // Prefill form with user data
            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                document.getElementById('editProfilePicture').src = userData.photoURL || "default-profile.png";
                document.getElementById('userNameInput').value = userData.displayName || "";
                document.getElementById('userEmailInput').value = user.email || "";
                document.getElementById('userPhoneInput').value = userData.phone || "";
                document.getElementById('userAddressInput').value = userData.address || "";
                document.getElementById('userNationalityInput').value = userData.nationality || "";
                document.getElementById('userGenderInput').value = userData.gender || "Not Provided";
                document.getElementById('userBirthdayInput').value = userData.birthday || "";
                document.getElementById('userReligionInput').value = userData.religion || "";
            }
        } else {
            window.location.href = "signin.html";
        }
    });

    editProfileForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const user = auth.currentUser;
        const name = document.getElementById('userNameInput').value;
        const email = document.getElementById('userEmailInput').value;
        const phone = document.getElementById('userPhoneInput').value;
        const address = document.getElementById('userAddressInput').value;
        const nationality = document.getElementById('userNationalityInput').value;
        const gender = document.getElementById('userGenderInput').value;
        const birthday = document.getElementById('userBirthdayInput').value;
        const religion = document.getElementById('userReligionInput').value;

        try {
            if (user) {
                // Update Firebase Authentication profile
                await updateProfile(user, {
                    displayName: name,
                    photoURL: user.photoURL, // Update if implementing photo upload
                });

                // Update email in Firebase Authentication
                if (user.email !== email) {
                    await updateEmail(user, email);
                }

                // Update additional fields in Firestore
                const userDocRef = doc(db, "users", user.uid);
                await setDoc(userDocRef, {
                    displayName: name,
                    email: email,
                    phone: phone,
                    address: address,
                    nationality: nationality,
                    gender: gender,
                    birthday: birthday,
                    religion: religion,
                    photoURL: user.photoURL,
                }, { merge: true });

                alert("Profile updated successfully!");
                window.location.href = "profile.html";
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please try again.");
        }
    });

