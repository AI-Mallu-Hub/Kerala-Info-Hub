async function loadQuestions() {
    const response = await fetch("data/psc_quiz.json");
    return await response.json();
}
function shuffle(array) {
    const arr = [...array];

    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
}
async function getPracticeQuiz(total = 50) {

    const questions = await loadQuestions();

    return shuffle(questions).slice(0, total);

}
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
async function getDailyQuiz(total = 50) {

    const questions = await loadQuestions();

    const today = new Date();

    const seed =
        today.getFullYear() * 10000 +
        (today.getMonth() + 1) * 100 +
        today.getDate();

    return seededShuffle(questions, seed).slice(0, total);

    }
async function startDailyQuiz(){

    const quiz = await getDailyQuiz(50);

    console.log(quiz);

      }
async function startPracticeQuiz(){

    const quiz = await getPracticeQuiz(50);

    console.log(quiz);

}
let seconds = 50 * 60;

setInterval(() => {

    seconds--;

    const min = Math.floor(seconds / 60);

    const sec = seconds % 60;

    document.getElementById("timer").innerHTML =
        `${min}:${sec.toString().padStart(2,'0')}`;

    if(seconds<=0){

        submitQuiz();

    }

},1000);
let score = 0;

quiz.forEach((q,index)=>{

    const selected = document.querySelector(
        `input[name="q${index}"]:checked`
    );

    if(selected && selected.value===q.correct_answer){

        score++;

    }

});

alert(`Score : ${score}/50`);
