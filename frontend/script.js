const API_URL = "http://127.0.0.1:8000/quiz";

let quiz = [];
let currentQuestion = 0;
let score = 0;

async function startQuiz() {

    try {

        const response = await fetch(API_URL);

        quiz = await response.json();

        document.querySelector(".welcome").innerHTML = `
            <p class="small-text">TODAY'S QUIZ</p>

            <h1>
                Quiz is ready!
            </h1>

            <p class="subtitle">
                ${quiz.length} questions loaded.
            </p>
        `;

    } catch (error) {

        document.querySelector(".welcome").innerHTML = `
            <h1>Oops!</h1>

            <p class="subtitle">
                Could not load the quiz.
            </p>
        `;

        console.error(error);
    }
}
document.getElementById("playButton").addEventListener("click", startQuiz);