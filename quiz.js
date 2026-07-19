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
