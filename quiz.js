// ----------------------------
// Global Variables
// ----------------------------

let quizQuestions = [];
let currentPage = 0;
const questionsPerPage = 5;
let userAnswers = {};
// Reviewed Pages
let reviewedPages = {};

// Locked Pages
let lockedPages = {};

// ----------------------------
// Load JSON
// ----------------------------

async function loadQuestions() {

    try {

        const response = await fetch("data/psc_quiz.json");

        if (!response.ok) {
            throw new Error("JSON file not found: " + response.status);
        }

        return await response.json();

    } catch (err) {

        console.error(err);

        alert("Quiz loading failed.\n\n" + err.message);

        return [];

    }

}

// ----------------------------
// Random Shuffle
// ----------------------------

function shuffle(array) {

    const arr = [...array];

    for (let i = arr.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
}

// ----------------------------
// Daily Shuffle
// ----------------------------

function seededRandom(seed) {

    let x = Math.sin(seed) * 10000;

    return x - Math.floor(x);

}

function seededShuffle(array, seed) {

    const arr = [...array];

    for (let i = arr.length - 1; i > 0; i--) {

        seed++;

        const j = Math.floor(seededRandom(seed) * (i + 1));

        [arr[i], arr[j]] = [arr[j], arr[i]];

    }

    return arr;

}

// ----------------------------
// Start Daily Quiz
// ----------------------------

async function startDailyQuiz() {

    const all = await loadQuestions();

    const today = new Date();

    const seed =
        today.getFullYear() * 10000 +
        (today.getMonth() + 1) * 100 +
        today.getDate();

    quizQuestions = seededShuffle(all, seed).slice(0, 50);

    startQuiz();

}

// ----------------------------
// Start Practice Quiz
// ----------------------------

async function startPracticeQuiz() {

    const all = await loadQuestions();

    quizQuestions = shuffle(all).slice(0, 50);

    startQuiz();

}

// ----------------------------
// Start Quiz
// ----------------------------

function startQuiz() {

    currentPage = 0;

    userAnswers = {};

    reviewedPages = {};

    lockedPages = {};

    document.getElementById("quizArea").style.display = "block";

    document.getElementById("resultBox").style.display = "none";

    renderPage();

}

// ----------------------------
// Render Questions
// ----------------------------

function renderPage() {

    const container = document.getElementById("quizContainer");

    container.innerHTML = "";
    document.getElementById("pageScore").style.display = "none";

    const start = currentPage * questionsPerPage;

    const end = Math.min(start + questionsPerPage, quizQuestions.length);

    document.getElementById("pageInfo").textContent =
        `Page ${currentPage + 1} / ${Math.ceil(quizQuestions.length / questionsPerPage)}`;

    document.getElementById("questionInfo").textContent =
        `Questions ${start + 1} - ${end} of ${quizQuestions.length}`;

    for (let i = start; i < end; i++) {

        const q = quizQuestions[i];

        container.innerHTML += `

<div class="quiz-card">

<h3>Q${i + 1}. ${q.question}</h3>

<label>
<input type="radio" name="q${i}" value="A"
${userAnswers[i] === "A" ? "checked" : ""}>
${q.options.A}
</label><br><br>

<label>
<input type="radio" name="q${i}" value="B"
${userAnswers[i] === "B" ? "checked" : ""}>
${q.options.B}
</label><br><br>

<label>
<input type="radio" name="q${i}" value="C"
${userAnswers[i] === "C" ? "checked" : ""}>
${q.options.C}
</label><br><br>

<label>
<input type="radio" name="q${i}" value="D"
${userAnswers[i] === "D" ? "checked" : ""}>
${q.options.D}
</label>

</div>

`;

    }

    document.querySelectorAll("input[type=radio]").forEach(radio => {

        radio.addEventListener("change", function () {

            const index = this.name.substring(1);

            userAnswers[index] = this.value;

        });

    });

    document.getElementById("prevBtn").style.display =
        currentPage === 0 ? "none" : "inline-block";

    if (currentPage === Math.ceil(quizQuestions.length / questionsPerPage) - 1) {

        document.getElementById("nextBtn").style.display = "none";

        document.getElementById("submitBtn").style.display = "inline-block";

    } else {

        document.getElementById("nextBtn").style.display = "inline-block";

        document.getElementById("submitBtn").style.display = "none";

    }

}

// ----------------------------
// Navigation
// ----------------------------

document.getElementById("nextBtn").addEventListener("click", () => {

    currentPage++;

    renderPage();

});

document.getElementById("prevBtn").addEventListener("click", () => {

    currentPage--;

    renderPage();

});
// ----------------------------
// Check Current Page Answers
// ----------------------------

document.getElementById("checkBtn").addEventListener("click", () => {

    const start = currentPage * questionsPerPage;

    const end = Math.min(start + questionsPerPage, quizQuestions.length);

    let pageScore = 0;

    for (let i = start; i < end; i++) {

        const q = quizQuestions[i];

        const labels =
            document.querySelectorAll(`input[name="q${i}"]`);

        labels.forEach(input => {

            const label = input.parentElement;

            input.disabled = true;

            if (input.value === q.correct_answer) {

                label.classList.add("correct");

            }

            if (
                userAnswers[i] === input.value &&
                input.value !== q.correct_answer
            ) {

                label.classList.add("wrong");

            }

        });

        if (userAnswers[i] === q.correct_answer) {

            pageScore++;

        }

    }

    reviewedPages[currentPage] = true;

    lockedPages[currentPage] = true;

    document.getElementById("pageScore").style.display = "block";

    document.getElementById("pageScore").textContent =
        `✅ Page Score : ${pageScore} / ${end - start}`;

    document.getElementById("checkBtn").disabled = true;

    document.getElementById("nextBtn").disabled = false;

});

// ----------------------------
// Submit
// ----------------------------

document.getElementById("submitBtn").addEventListener("click", () => {

    // ----------------------------
// Check Button / Next Button
// ----------------------------

const checkBtn = document.getElementById("checkBtn");
const nextBtn = document.getElementById("nextBtn");

// എല്ലാ പുതിയ page-കളിലും ആദ്യം reset ചെയ്യുക
checkBtn.disabled = false;

if (reviewedPages[currentPage]) {

    checkBtn.disabled = true;
    nextBtn.disabled = false;

} else {

    nextBtn.disabled = true;

}

    let score = 0;

    quizQuestions.forEach((q, index) => {

        if (userAnswers[index] === q.correct_answer) {

            score++;

        }

    });

    document.getElementById("quizArea").style.display = "none";

    document.getElementById("resultBox").style.display = "block";

    document.getElementById("scoreText").textContent =
        `Score : ${score} / ${quizQuestions.length}`;

    document.getElementById("correctText").textContent =
        `✅ Correct : ${score}`;

    document.getElementById("wrongText").textContent =
        `❌ Wrong : ${quizQuestions.length - score}`;

});
