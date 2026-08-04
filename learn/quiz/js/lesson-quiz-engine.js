/*====================================================
    Lesson Quiz Engine V1.0.0
    Build 1 - Core Foundation
====================================================*/

const quizState = {

    lesson: null,

    questions: [],

    currentQuestion: 0

};


/*====================================================
    Start Engine
====================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initQuiz();

});


/*====================================================
    Initialize Quiz
====================================================*/

async function initQuiz() {

    quizState.lesson = getLessonName();

    await loadQuestions();

    renderQuestion();

}


/*====================================================
    Get Lesson Name
====================================================*/

function getLessonName() {

    const params = new URLSearchParams(window.location.search);

    return params.get("lesson") || "cell";

}


/*====================================================
    Load Questions
====================================================*/

async function loadQuestions() {

    const filePath = `data/${quizState.lesson}.json`;

    const response = await fetch(filePath);

    if (!response.ok) {

        throw new Error("Unable to load lesson JSON.");

    }

    quizState.questions = await response.json();

}


/*====================================================
    Render Question
====================================================*/

function renderQuestion() {

    const question = quizState.questions[quizState.currentQuestion];

    if (!question) return;

    document.getElementById("questionNumber").textContent =
        quizState.currentQuestion + 1;

    document.getElementById("questionText").textContent =
        question.question;

}
