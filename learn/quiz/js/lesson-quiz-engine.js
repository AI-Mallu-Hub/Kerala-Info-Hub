
/*====================================================
    Lesson Quiz Engine V1.0.0
    Build 1 - Core Foundation
====================================================*/

const quizState = {

    lesson: null,

    questions: [],

    currentQuestion: 0,

    selectedOption: null,

    answered: false,

    currentButtonMode: "submit",

    score: 0,

    userAnswers: []

};


/*====================================================
    Start Engine
====================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initQuiz();

document
.getElementById("submitBtn")
.addEventListener("click",()=>{

    if (
    quizState.currentButtonMode === "submit"
) {

    checkAnswer();

}
else if (
    quizState.currentButtonMode === "next"
) {

    nextQuestion();

}
else {

    showResult();

}

});

});


document
.getElementById("retryBtn")
.addEventListener("click",()=>{

    location.reload();

});


document
.getElementById("backLessonBtn")
.addEventListener("click", () => {

    window.location.href =
    `../anatomy/${quizState.lesson}/index.html`;

});

/*====================================================
    Initialize Quiz
====================================================*/

async function initQuiz() {

    quizState.lesson = getLessonName();

    quizState.score = 0;

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

    const allQuestions = await response.json();

    quizState.questions = allQuestions.slice(0, 10);
}


/*====================================================
    Render Question
====================================================*/

function renderQuestion() {

document
.getElementById("explanationCard")
.classList.add("hidden");

    quizState.currentButtonMode = "submit";

const submitBtn =
document.getElementById("submitBtn");

submitBtn.textContent = "Submit";

    const question = quizState.questions[quizState.currentQuestion];

    quizState.answered = false;

    if (!question) return;

    document.getElementById("questionNumber").textContent =
        quizState.currentQuestion + 1;

    document.getElementById("questionText").textContent =
        question.question;

    renderOptions(question);

}


function nextQuestion(){

    if(
        quizState.currentQuestion >=
        quizState.questions.length
    ){

        alert("Quiz Finished");

        return;

    }
    quizState.currentQuestion++;

    renderQuestion();

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

    const isCorrect =
    quizState.selectedOption ===
    question.answer;

    quizState.userAnswers[quizState.currentQuestion] =
    quizState.selectedOption;

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
    

    const submitBtn =
document.getElementById("submitBtn");

    showExplanation();

if(
    quizState.currentQuestion ===
    quizState.questions.length-1
){
    quizState.currentButtonMode="result";

    submitBtn.textContent =
    "View Result 📊";

}
else{

    quizState.currentButtonMode = "next";

    submitBtn.textContent =
    "Next Question ➜";

}
    
if (isCorrect) {

    quizState.score++;

                }
}


function showResult(){

    document.getElementById("quizArea").style.display =
    "none";

    document.getElementById("resultScreen").style.display =
    "block";

    document.getElementById("finalScore").textContent =
    `${quizState.score}/${quizState.questions.length}`;

    const percent = Math.round(

        quizState.score /
        quizState.questions.length * 100

    );

    document.getElementById("finalPercentage").textContent =
    percent + "%";

    const message =
document.getElementById("performanceMessage");

if(percent>=90){

    message.textContent =
    "🌟 Excellent!";

}
else if(percent>=75){

    message.textContent =
    "🎉 Great Job!";

}
else if(percent>=60){

    message.textContent =
    "👍 Good Work!";

}
else if(percent>=40){

    message.textContent =
    "📚 Keep Practicing!";

}
else{

    message.textContent =
    "💪 Don't Give Up!";

}

}


function showExplanation(){

    const question =
    quizState.questions[quizState.currentQuestion];

    document
    .getElementById("explanation")
    .textContent =
    question.explanation;

    document
    .getElementById("clinical")
    .textContent =
    question.clinicalPearl;

    document
    .getElementById("examTip")
    .textContent =
    question.examTip;

    document
    .getElementById("explanationCard")
    .classList.remove("hidden");

    document.getElementById("explanationCard").scrollIntoView({
    behavior: "smooth",
    block: "center"
});
}
