
const explanationCard =
document.getElementById("explanationCard");

const answerStatus =
document.getElementById("answerStatus");

const explanationText =
document.getElementById("explanationText");

const clinicalText =
document.getElementById("clinicalText");

const examTipText =
document.getElementById("examTipText");



function showExplanation(isCorrect){

explanationCard.classList.remove("hidden");

answerStatus.className="answer-status";

if(isCorrect){

answerStatus.classList.add("correct");

answerStatus.textContent="✅ Correct Answer";

}else{

answerStatus.classList.add("wrong");

answerStatus.textContent="❌ Incorrect Answer";

}

explanationText.textContent=
"Explanation will load from JSON in Part B.";

clinicalText.textContent=
"Clinical Pearl will load in Part B.";

examTipText.textContent=
"Exam Tip will load in Part B.";

explanationCard.scrollIntoView({

behavior:"smooth",

block:"start"

});

}
