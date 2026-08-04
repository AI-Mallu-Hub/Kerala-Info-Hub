
const quizState = {

    lesson: null,

    questions: [],

    selectedQuestions: [],

    currentQuestion: 0,

    score: 0

};

function getLessonName(){

    const params = new URLSearchParams(window.location.search);

    return params.get("lesson");

}

async function loadQuiz(){

    quizState.lesson = getLessonName();

    if(!quizState.lesson){

        alert("Lesson not specified.");

        return;

    }

    const path = `data/${quizState.lesson}.json`;

    try{

        const response = await fetch(path);

        if(!response.ok){

            throw new Error("Quiz JSON not found.");

        }

        quizState.questions = await response.json();

        console.log(
            `${quizState.questions.length} Questions Loaded`
        );

    }

    catch(err){

        console.error(err);

        alert("Unable to load quiz.");

    }

      }

document.addEventListener("DOMContentLoaded",()=>{

    loadQuiz();

});
