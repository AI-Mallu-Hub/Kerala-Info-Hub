/*====================================================
    Lesson Quiz Engine V1.0.0
    Build 1 - Core Foundation
====================================================*/

const quizState = {

    lesson: null,

    questions: [],

    currentQuestion: 0,

    selectedOption: null,

    answered: false

};


/*====================================================
    Start Engine
====================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initQuiz();

document
    .getElementById("submitBtn")
    .addEventListener("click", checkAnswer);

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

    quizState.answered = false;

    if (!question) return;

    document.getElementById("questionNumber").textContent =
        quizState.currentQuestion + 1;

    document.getElementById("questionText").textContent =
        question.question;

    renderOptions(question);

}


/*====================================================
    Render Options
====================================================*/

function renderOptions(question) {

    const container =
        document.getElementById("optionsContainer");

    container.innerHTML = "";

    quizState.selectedOption = null;

    Object.entries(question.options).forEach(([key, value]) => {

        const button =
            document.createElement("button");

        button.className = "quiz-option";

        button.innerHTML =
            `<strong>${key}.</strong> ${value}`;

        button.addEventListener("click", () => {

            if (quizState.answered) return;

            document
                .querySelectorAll(".quiz-option")
                .forEach(btn =>
                    btn.classList.remove("selected")
                );

            button.classList.add("selected");

            quizState.selectedOption = key;

        });

        container.appendChild(button);

    });

}


/*====================================================
    Check Answer
====================================================*/

function checkAnswer() {

    if (quizState.selectedOption === null) {

        alert("Please select an answer.");

        return;

    }

    quizState.answered = true;

    const question =
        quizState.questions[quizState.currentQuestion];

    document
        .querySelectorAll(".quiz-option")
        .forEach(button => {

            const option =
                button.querySelector("strong")
                .textContent.replace(".", "");

            if (option === question.answer) {

                button.classList.add("correct");

            }

            if (
                option === quizState.selectedOption &&
                option !== question.answer
            ) {

                button.classList.add("wrong");

            }

        });

}

