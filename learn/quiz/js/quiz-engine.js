/*====================================================
      Kerala Info Hub
      Quiz Engine V1.0.1A
=====================================================*/

const quizState = {

    lesson: null,

    questions: [],

    selectedQuestions: [],

    currentQuestion: 0,

    score: 0,

    selectedOption: null

};

/*====================================================
      Initialize
=====================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initQuiz();

});

/*====================================================
      Main
=====================================================*/

async function initQuiz(){

    quizState.lesson = getLessonName();

    if(!quizState.lesson){

        alert("Lesson parameter missing.");

        return;

    }

    await loadQuestions();

    prepareQuiz();

    renderQuestion();

}

/*====================================================
      Read Lesson Name
=====================================================*/

function getLessonName(){

    const params = new URLSearchParams(window.location.search);

    return params.get("lesson");

}

/*====================================================
      Load JSON
=====================================================*/

async function loadQuestions(){

    const path =
    `data/${quizState.lesson}.json`;

    const response =
    await fetch(path);

    if(!response.ok){

        throw new Error("Unable to load JSON.");

    }

    quizState.questions =
    await response.json();

}

/*====================================================
      Prepare Quiz
=====================================================*/

function prepareQuiz(){

    const shuffled =
    shuffleArray([...quizState.questions]);

    quizState.selectedQuestions =
    shuffled.slice(0,10);

    quizState.currentQuestion = 0;

    quizState.score = 0;

}

/*====================================================
      Shuffle
=====================================================*/

function shuffleArray(array){

    for(

        let i=array.length-1;

        i>0;

        i--

    ){

        const j =
        Math.floor(
            Math.random()*(i+1)
        );

        [array[i],array[j]] =
        [array[j],array[i]];

    }

    return array;

}

/*====================================================
      Current Question
=====================================================*/

function getCurrentQuestion(){

    return quizState.selectedQuestions[
        quizState.currentQuestion
    ];

}

/*====================================================
      Render Question
=====================================================*/

function renderQuestion(){

    const q = getCurrentQuestion();

    if(!q) return;

    document.getElementById("questionNumber")
        .textContent =
        quizState.currentQuestion + 1;

    document.getElementById("questionText")
        .textContent =
        q.question;

    renderOptions(q);

    updateProgress();

}

/*====================================================
      Render Options
=====================================================*/

function renderOptions(question){

    const container =
    document.getElementById(
        "optionsContainer"
    );

    container.innerHTML = "";

    quizState.selectedOption = null;

    Object.entries(question.options)
    .forEach(([key,value])=>{

        const option =
        document.createElement("button");

        option.className =
        "quiz-option";

        option.innerHTML =
        `<strong>${key}.</strong> ${value}`;

        option.onclick = ()=>{

            document
            .querySelectorAll(".quiz-option")
            .forEach(btn=>
                btn.classList.remove("selected")
            );

            option.classList.add("selected");

            quizState.selectedOption = key;

        };

        container.appendChild(option);

    });

}

/*====================================================
      Progress Bar
=====================================================*/

function updateProgress(){

    const percent =
    ((quizState.currentQuestion+1)/10)*100;

    document
    .getElementById("progressFill")
    .style.width =
    percent + "%";

                  }

