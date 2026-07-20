// ============================
// Global Variables
// ============================

let quizQuestions = [];
let currentPage = 0;

const questionsPerPage = 5;

let userAnswers = {};
let reviewedPages = {};
let lockedPages = {};

// ============================
// Load Questions
// ============================

async function loadQuestions() {

    try {

        const response = await fetch("data/psc_quiz.json");

        if (!response.ok) {
            throw new Error("Unable to load question file.");
        }

        return await response.json();

    } catch (err) {

        console.error(err);

        alert(err.message);

        return [];

    }

}

// ============================
// Random Shuffle
// ============================

function shuffle(array) {

    const arr = [...array];

    for (let i = arr.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [arr[i], arr[j]] = [arr[j], arr[i]];

    }

    return arr;

}

// ============================
// Daily Shuffle
// ============================

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

// ============================
// Daily Quiz
// ============================

async function startDailyQuiz() {

    const allQuestions = await loadQuestions();

    const today = new Date();

    const seed =
        today.getFullYear() * 10000 +
        (today.getMonth() + 1) * 100 +
        today.getDate();

    quizQuestions =
        seededShuffle(allQuestions, seed).slice(0, 50);

    startQuiz();

}

// ============================
// Practice Quiz
// ============================

async function startPracticeQuiz() {

    const allQuestions = await loadQuestions();

    quizQuestions =
        shuffle(allQuestions).slice(0, 50);

    startQuiz();

}

// ============================
// Start Quiz
// ============================

function startQuiz() {

    currentPage = 0;

    userAnswers = {};
    reviewedPages = {};
    lockedPages = {};

    document.getElementById("quizArea").style.display = "block";

    document.getElementById("resultBox").style.display = "none";

    renderPage();

                            }
// ============================
// Render Page
// ============================

function renderPage() {

    const container = document.getElementById("quizContainer");

    const pageInfo = document.getElementById("pageInfo");

    const questionInfo = document.getElementById("questionInfo");

    const pageScore = document.getElementById("pageScore");

    const prevBtn = document.getElementById("prevBtn");

    const nextBtn = document.getElementById("nextBtn");

    const checkBtn = document.getElementById("checkBtn");

    const submitBtn = document.getElementById("submitBtn");

    container.innerHTML = "";

    pageScore.style.display = "none";
    pageScore.textContent = "";

    const start = currentPage * questionsPerPage;

    const end = Math.min(start + questionsPerPage, quizQuestions.length);

    pageInfo.textContent =
        `Page ${currentPage + 1} / ${Math.ceil(quizQuestions.length / questionsPerPage)}`;

    questionInfo.textContent =
        `Questions ${start + 1} - ${end} of ${quizQuestions.length}`;

    // ----------------------------
    // Render Questions
    // ----------------------------

    for (let i = start; i < end; i++) {

        const q = quizQuestions[i];

        const card = document.createElement("div");

        card.className = "quiz-card";

        card.innerHTML = `
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
        `;

        container.appendChild(card);

    }

    // ----------------------------
    // Save Selected Answers
    // ----------------------------

    document.querySelectorAll("input[type=radio]").forEach(radio => {

        radio.addEventListener("change", function () {

            const index = Number(this.name.substring(1));

            userAnswers[index] = this.value;

        });

    });

    // ----------------------------
    // Navigation Buttons
    // ----------------------------

    prevBtn.style.display =
        currentPage === 0 ? "none" : "inline-block";

    const lastPage =
        currentPage === Math.ceil(quizQuestions.length / questionsPerPage) - 1;

    nextBtn.style.display =
        lastPage ? "none" : "inline-block";

    submitBtn.style.display =
        lastPage ? "inline-block" : "none";
    submitBtn.disabled = !reviewedPages[currentPage];

    // ----------------------------
    // Check Button State
    // ----------------------------

if (reviewedPages[currentPage]) {

    checkBtn.disabled = true;

    if (lastPage) {

        submitBtn.disabled = false;

    } else {

        nextBtn.disabled = false;

    }

} else {

    checkBtn.disabled = false;

    nextBtn.disabled = true;

    if (lastPage) {

        submitBtn.disabled = true;

    }

  }
    restoreReviewedPage();
}
// ============================
// Previous Button
// ============================

document.getElementById("prevBtn").addEventListener("click", () => {

    if (currentPage > 0) {

        currentPage--;

        renderPage();

    }

});

// ============================
// Next Button
// ============================

document.getElementById("nextBtn").addEventListener("click", () => {

    const totalPages = Math.ceil(quizQuestions.length / questionsPerPage);

    if (currentPage < totalPages - 1) {

        currentPage++;

        renderPage();

    }

});

// ============================
// Check Answers
// ============================

document.getElementById("checkBtn").addEventListener("click", () => {

    const start = currentPage * questionsPerPage;
    const end = Math.min(start + questionsPerPage, quizQuestions.length);
    const hasAnswer = Object.keys(userAnswers)
    .some(index => {
        const num = Number(index);
        return num >= start && num < end;
    });

if (!hasAnswer) {

    alert("Please answer at least one question before checking.");

    return;

}
    let pageScore = 0;

    for (let i = start; i < end; i++) {

        const q = quizQuestions[i];

        const radios = document.querySelectorAll(`input[name="q${i}"]`);

        radios.forEach(radio => {

            const label = radio.parentElement;

            // പഴയ classes remove ചെയ്യുക
            label.classList.remove("correct");
            label.classList.remove("wrong");

            // answers lock ചെയ്യുക
            radio.disabled = true;

            // Correct Answer
            if (radio.value === q.correct_answer) {

                label.classList.add("correct");

            }

            // Wrong Selected Answer
            if (
                userAnswers[i] === radio.value &&
                radio.value !== q.correct_answer
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

    const pageScoreBox = document.getElementById("pageScore");

    pageScoreBox.style.display = "block";

    pageScoreBox.textContent =
        `✅ Page Score : ${pageScore} / ${end - start}`;

    document.getElementById("checkBtn").disabled = true;

    const totalPages = Math.ceil(quizQuestions.length / questionsPerPage);

if (currentPage === totalPages - 1) {

    document.getElementById("submitBtn").disabled = false;

} else {

    document.getElementById("nextBtn").disabled = false;

}

});

// ============================
// Restore Reviewed Pages
// ============================

function restoreReviewedPage() {

    if (!reviewedPages[currentPage]) return;

    const start = currentPage * questionsPerPage;
    const end = Math.min(start + questionsPerPage, quizQuestions.length);

    let pageScore = 0;

    for (let i = start; i < end; i++) {

        const q = quizQuestions[i];

        const radios = document.querySelectorAll(`input[name="q${i}"]`);

        radios.forEach(radio => {

            const label = radio.parentElement;

            radio.disabled = true;

            if (radio.value === q.correct_answer) {

                label.classList.add("correct");

            }

            if (
                userAnswers[i] === radio.value &&
                radio.value !== q.correct_answer
            ) {

                label.classList.add("wrong");

            }

        });

        if (userAnswers[i] === q.correct_answer) {

            pageScore++;

        }

    }

    const pageScoreBox = document.getElementById("pageScore");

    pageScoreBox.style.display = "block";

    pageScoreBox.textContent =
        `✅ Page Score : ${pageScore} / ${end - start}`;

   }
// ============================
// Render Review
// ============================

function renderReview() {

    const container = document.getElementById("reviewContainer");

    container.innerHTML = "";

    quizQuestions.forEach((q, index) => {

        const userAnswer = userAnswers[index];
       console.log(index, userAnswer, q.correct_answer, userAnswer === q.correct_answer);
        const userText = userAnswer
            ? `${userAnswer}. ${q.options[userAnswer]}`
            : "Not Answered";

        const correctText =
            `${q.correct_answer}. ${q.options[q.correct_answer]}`;

           let answerIcon = "";


if (!userAnswer) {

    answerIcon = "⚪";

} else if (userAnswer === q.correct_answer) {

    answerIcon = "✅";

} else {

    answerIcon = "❌";

}
        const card = document.createElement("div");

        card.className = "review-card";

        card.innerHTML = `

            <h3>Q${index + 1}. ${q.question}</h3>

            <p class="review-answer">
    ${
        userAnswer
            ? `${answerIcon} <strong>Your Answer:</strong> ${userText}`
            : `⚪ <strong>Not Answered</strong>`
         }
           </p>

            <p class="review-answer">
                ✅ <strong>Correct Answer:</strong> ${correctText}
            </p>

            <button
                class="explanation-btn"
                data-index="${index}">
                📖 Explanation
            </button>

        `;

        container.appendChild(card);

    });

   }
// ============================
// Submit Quiz
// ============================

document.getElementById("submitBtn").addEventListener("click", () => {

    let score = 0;

    quizQuestions.forEach((q, index) => {

        if (userAnswers[index] === q.correct_answer) {

            score++;

        }

    });

    const wrong = quizQuestions.length - score;

    const percentage = ((score / quizQuestions.length) * 100).toFixed(1);

    let grade = "";

    if (percentage >= 90) {

        grade = "🏆 Excellent";

    } else if (percentage >= 75) {

        grade = "🥇 Very Good";

    } else if (percentage >= 60) {

        grade = "👍 Good";

    } else if (percentage >= 40) {

        grade = "🙂 Keep Practicing";

    } else {

        grade = "📚 Needs More Practice";

    }

    document.getElementById("quizArea").style.display = "none";

    document.getElementById("resultBox").style.display = "block";

    document.getElementById("scoreText").textContent =
        `Score : ${score} / ${quizQuestions.length}`;

    document.getElementById("correctText").textContent =
        `✅ Correct : ${score} | ❌ Wrong : ${wrong}`;

    document.getElementById("wrongText").textContent =
        `📊 Percentage : ${percentage}% | ${grade}`;

});

// ============================
// Retake Quiz
// ============================

document.getElementById("retakeBtn").addEventListener("click", () => {

    if (confirm("Start a new quiz?")) {

        startPracticeQuiz();

    }

});


// ============================
// Review All Answers
// ============================

    document.getElementById("reviewBtn").addEventListener("click", () => {

        renderReview();
        
    document.getElementById("resultBox").style.display = "none";

    document.getElementById("reviewSection").style.display = "block";

});

// ============================
// Close Review
// ============================

document.getElementById("closeReviewBtn").addEventListener("click", () => {

    document.getElementById("reviewSection").style.display = "none";

    document.getElementById("resultBox").style.display = "block";

});
