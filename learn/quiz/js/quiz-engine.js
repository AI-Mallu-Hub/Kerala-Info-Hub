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
