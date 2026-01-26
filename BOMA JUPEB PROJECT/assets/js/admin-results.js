/************************************
 * Firebase Init
 ************************************/
const firebaseConfig = {
  apiKey: "AIzaSyC9wkWxQbbKzTDSywioxDyqFct9mlOwi30",
  authDomain: "boma-917e7.firebaseapp.com",
  projectId: "boma-917e7",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

/************************************
 * DOM Elements (MATCHING YOUR HTML)
 ************************************/
const saveBtn = document.querySelector(".signup-form .box-btn"); // Save Result
const publishBtn = document.getElementById("publishResultsBtn");    // Publish Now

const programSelect = document.querySelector("select");
const studentNameInput = document.querySelector("input[placeholder='Student full name']");
const studentIdInput = document.querySelector("input[placeholder='BIA/2024/021']");
const dateInput = document.querySelector("input[type='date']");
const scoreInput = document.querySelector("input[type='number']");
const tableBody = document.querySelector("table tbody");

/************************************
 * SAVE RESULT
 ************************************/
saveBtn.addEventListener("click", async () => {
  const program = programSelect.value;
  const studentName = studentNameInput.value.trim();
  const studentId = studentIdInput.value.trim();
  const assessmentDate = dateInput.value;
  const score = Number(scoreInput.value);

  if (!studentName || !studentId || !assessmentDate || isNaN(score)) {
    alert("Please fill all fields correctly.");
    return;
  }

  try {
    await db
      .collection("admin_data")
      .doc("results")
      .collection("entries")
      .add({
        program,
        student_name: studentName,
        student_id: studentId,
        assessment_date: assessmentDate,
        score,
        created_at: firebase.firestore.FieldValue.serverTimestamp(),
      });

    clearForm();
    loadResults();
    alert("Result saved successfully");

  } catch (err) {
    console.error("Save error:", err);
    alert("Error saving result");
  }
});

/************************************
 * LOAD RESULTS INTO TABLE
 ************************************/
async function loadResults() {
  tableBody.innerHTML = "";

  const snapshot = await db
    .collection("admin_data")
    .doc("results")
    .collection("entries")
    .orderBy("created_at", "desc")
    .get();

  snapshot.forEach(doc => {
    const r = doc.data();

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${r.program}</td>
      <td>${r.student_name}</td>
      <td>${r.student_id}</td>
      <td>${formatDate(r.assessment_date)}</td>
      <td>${r.score}</td>
      <td>
        <a href="#" class="line-bnt" data-id="${doc.id}">Delete</a>
      </td>
    `;

    tableBody.appendChild(row);
  });

  attachDeleteHandlers();
}

/************************************
 * DELETE RESULT
 ************************************/
function attachDeleteHandlers() {
  document.querySelectorAll(".line-bnt").forEach(btn => {
    btn.addEventListener("click", async e => {
      e.preventDefault();

      const id = btn.dataset.id;
      if (!confirm("Delete this result?")) return;

      await db
        .collection("admin_data")
        .doc("results")
        .collection("entries")
        .doc(id)
        .delete();

      loadResults();
    });
  });
}

/************************************
 * Publish Results
 ************************************/
publishBtn.addEventListener("click", async (e) => {
  e.preventDefault(); // IMPORTANT for <a> tags

  const ok = confirm(
    "This will publish all current results to the public page. Continue?"
  );

  if (!ok) return;

  try {
    await db.collection("meta").doc("results").set({
      published: true,
      published_at: firebase.firestore.FieldValue.serverTimestamp(),
    });

    alert("Results published successfully");
  } catch (err) {
    console.error("Publish error:", err);
    alert("Failed to publish results");
  }
});


/************************************
 * HELPERS
 ************************************/
function clearForm() {
  studentNameInput.value = "";
  studentIdInput.value = "";
  dateInput.value = "";
  scoreInput.value = "";
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/************************************
 * INIT
 ************************************/
document.addEventListener("DOMContentLoaded", loadResults);
