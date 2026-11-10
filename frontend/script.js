const API_URL = "http://127.0.0.1:8000/quiz";

let quiz = [];
let currentQuestion = 0;
let answers = [];

const welcome = document.querySelector(".welcome");
const quizCard = document.querySelector(".quiz-card");
const stats = document.querySelector(".stats");

async function startQuiz() {
    const playButton = document.getElementById("playButton");
    if (playButton) {
        playButton.disabled = true;
        playButton.textContent = "LOADING...";
    }

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Quiz request failed (${response.status}).`);
        }

        const loadedQuiz = await response.json();
        if (!Array.isArray(loadedQuiz) || loadedQuiz.length === 0) {
            throw new Error("The quiz response did not contain any questions.");
        }

        quiz = loadedQuiz;
        currentQuestion = 0;
        answers = [];
        document.body.classList.add("quiz-mode");
        showQuestion();
    } catch (error) {
        welcome.replaceChildren();
        const title = document.createElement("h1");
        title.textContent = "Oops!";
        const message = document.createElement("p");
        message.className = "subtitle";
        message.textContent = "Could not load the quiz. Please try again.";
        welcome.append(title, message);
        console.error(error);
    } finally {
        const currentPlayButton = document.getElementById("playButton");
        if (currentPlayButton) {
            currentPlayButton.disabled = false;
            currentPlayButton.textContent = "PLAY NOW →";
        }
    }
}

function showQuestion() {
    const question = quiz[currentQuestion];
    welcome.replaceChildren();

    const progress = document.createElement("p");
    progress.className = "small-text";
    progress.textContent = `QUESTION ${currentQuestion + 1} OF ${quiz.length}`;

    const title = document.createElement("h1");
    title.textContent = question.question;

    const subtitle = document.createElement("p");
    subtitle.className = "subtitle";
    subtitle.textContent = "Choose the correct answer.";
    welcome.append(progress, title, subtitle);

    quizCard.replaceChildren();
    const options = document.createElement("div");
    options.className = "options";

    question.options.forEach((option) => {
        const button = document.createElement("button");
        button.className = "option-button";
        button.type = "button";
        button.textContent = option;
        button.addEventListener("click", () => selectAnswer(button, option));
        options.append(button);
    });

    const feedback = document.createElement("p");
    feedback.className = "answer-feedback";
    feedback.setAttribute("aria-live", "polite");

    const nextButton = document.createElement("button");
    nextButton.className = "next-button";
    nextButton.type = "button";
    nextButton.textContent = currentQuestion === quiz.length - 1
        ? "SEE RESULTS →"
        : "NEXT QUESTION →";
    nextButton.disabled = true;
    nextButton.addEventListener("click", nextQuestion);

    quizCard.append(options, feedback, nextButton);
    stats.style.display = "none";
}

function selectAnswer(selectedButton, selectedOption) {
    const question = quiz[currentQuestion];
    const isCorrect = selectedOption === question.answer;
    answers[currentQuestion] = isCorrect;

    quizCard.querySelectorAll(".option-button").forEach((button) => {
        button.disabled = true;
        if (button.textContent === question.answer) {
            button.classList.add("option-correct");
        }
    });

    const feedback = quizCard.querySelector(".answer-feedback");
    if (isCorrect) {
        selectedButton.classList.add("option-correct");
        feedback.textContent = "Correct! Press NEXT QUESTION to continue.";
        feedback.classList.add("feedback-correct");
    } else {
        selectedButton.classList.add("option-incorrect");
        feedback.textContent = `Incorrect. The right answer is: ${question.answer}. Press NEXT QUESTION to continue.`;
        feedback.classList.add("feedback-incorrect");
    }

    const nextButton = quizCard.querySelector(".next-button");
    nextButton.disabled = false;
    nextButton.focus();
}

function nextQuestion() {
    if (currentQuestion < quiz.length - 1) {
        currentQuestion += 1;
        showQuestion();
        welcome.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
    }

    showResults();
}

function showResults() {
    const correctCount = answers.filter(Boolean).length;
    const incorrectCount = answers.length - correctCount;
    const correctPercentage = (correctCount / answers.length) * 100;

    welcome.replaceChildren();
    const label = document.createElement("p");
    label.className = "small-text";
    label.textContent = "QUIZ COMPLETE";
    const title = document.createElement("h1");
    title.textContent = "Your results";
    const subtitle = document.createElement("p");
    subtitle.className = "subtitle";
    subtitle.textContent = `You got ${correctCount} out of ${answers.length} questions right.`;
    welcome.append(label, title, subtitle);

    quizCard.replaceChildren();
    quizCard.classList.add("results-card");

    const chart = document.createElement("div");
    chart.className = "results-chart";
    chart.style.setProperty("--correct-share", `${correctPercentage}%`);
    chart.setAttribute(
        "aria-label",
        `${correctCount} correct and ${incorrectCount} incorrect`,
        );
    chart.setAttribute("role", "img");
    const chartCenter = document.createElement("div");
    chartCenter.className = "chart-center";
    const score = document.createElement("strong");
    score.textContent = `${Math.round(correctPercentage)}%`;
    const scoreLabel = document.createElement("span");
    scoreLabel.textContent = "CORRECT";
    chartCenter.append(score, scoreLabel);
    chart.append(chartCenter);

    const legend = document.createElement("div");
    legend.className = "results-legend";
    legend.append(
        createLegendItem("legend-correct", "Correct", correctCount),
        createLegendItem("legend-incorrect", "Incorrect", incorrectCount),
    );

    const replayButton = document.createElement("button");
    replayButton.className = "next-button";
    replayButton.type = "button";
    replayButton.textContent = "PLAY AGAIN →";
    replayButton.addEventListener("click", startQuiz);
    quizCard.append(chart, legend, replayButton);
}

function createLegendItem(colorClass, label, count) {
    const item = document.createElement("div");
    item.className = "legend-item";
    const marker = document.createElement("span");
    marker.className = `legend-marker ${colorClass}`;
    const text = document.createElement("span");
    text.textContent = `${label}: ${count}`;
    item.append(marker, text);
    return item;
}

document.getElementById("playButton").addEventListener("click", startQuiz);
