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
 * DOM Elements
 ************************************/
const tableBody = document.getElementById("resultsTableBody");
const noticeBox = document.getElementById("resultsNotice");

const totalStudentsEl = document.getElementById("totalStudents");
const passRateEl = document.getElementById("passRate");
const avgImprovementEl = document.getElementById("avgImprovement");

/************************************
 * Load Public Results
 ************************************/
async function loadPublicResults() {
  try {
    // 1. Check publish status
    const metaSnap = await db.collection("meta").doc("results").get();

    if (!metaSnap.exists || metaSnap.data().published !== true) {
      showNotPublished();
      return;
    }

    // 2. Fetch published results
    const snapshot = await db
      .collection("admin_data")
      .doc("results")
      .collection("entries")
      .orderBy("created_at", "desc")
      .get();

    if (snapshot.empty) {
      showNotPublished();
      return;
    }

    // 3. Render table + counters
    renderResults(snapshot.docs.map(doc => doc.data()));

  } catch (err) {
    console.error("Public results error:", err);
    showNotPublished();
  }
}

/************************************
 * Render Results
 ************************************/
function renderResults(results) {
  tableBody.innerHTML = "";

  let total = results.length;
  let passCount = 0;
  let totalScore = 0;

  results.forEach(r => {
    // Table row
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${r.program}</td>
      <td>${r.student_name}</td>
      <td>${r.student_id}</td>
      <td>${formatDate(r.assessment_date)}</td>
      <td>${r.score}</td>
    `;
    tableBody.appendChild(tr);

    // Stats
    totalScore += Number(r.score);
    if (r.score >= 50) passCount++;
  });

  // Counters
  totalStudentsEl.textContent = total;
  passRateEl.textContent = total === 0 ? 0 : Math.round((passCount / total) * 100);
  avgImprovementEl.textContent =
    total === 0 ? 0 : Math.round(totalScore / total);

  noticeBox.style.display = "none";
}

/************************************
 * Not Published State
 ************************************/
function showNotPublished() {
  tableBody.innerHTML = "";
  noticeBox.style.display = "block";

  totalStudentsEl.textContent = "0";
  passRateEl.textContent = "0";
  avgImprovementEl.textContent = "0";
}

/************************************
 * Helpers
 ************************************/
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/************************************
 * Init
 ************************************/
document.addEventListener("DOMContentLoaded", loadPublicResults);
