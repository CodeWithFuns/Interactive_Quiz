document.addEventListener("DOMContentLoaded", function () {
    const startBtn = document.getElementById('start-btn');
    const questionContainer = document.getElementById('question-container');
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const messageElement = document.getElementById('message');
    const lockBtn = document.getElementById('lock-btn');
    const nextBtn = document.getElementById('next-btn');
    const exitBtn = document.getElementById('exit-btn');
    const timerElement = document.getElementById('timer');
    const correctScoreElement = document.getElementById('correct');
    const incorrectScoreElement = document.getElementById('incorrect');
    const unsolvedScoreElement = document.getElementById('unsolved');
    const totalScoreElement = document.getElementById('total');
    
    let currentQuestionIndex = 0;
    let questions = [];
    let selectedOption = null;
    let correctCount = 0;
    let incorrectCount = 0;
    let unsolvedCount = 0;
    let timer;

    startBtn.addEventListener('click', startQuiz);
    lockBtn.addEventListener('click', lockAnswer);
    nextBtn.addEventListener('click', nextQuestion);
    exitBtn.addEventListener('click', exitQuiz);

    function startQuiz() {
        startBtn.classList.add('hidden');
        questionContainer.classList.remove('hidden');
        exitBtn.classList.remove('hidden');
        fetchQuestions();
    }

    function fetchQuestions() {
        fetch('https://opentdb.com/api.php?amount=10&category=9&type=multiple')
            .then(response => response.json())
            .then(data => {
                questions = data.results;
                totalScoreElement.textContent = `Total: ${questions.length}`;
                showQuestion();
                startTimer();
            });
    }

    function showQuestion() {
        resetState();
        const questionData = questions[currentQuestionIndex];
        questionElement.textContent = questionData.question;

        questionData.incorrect_answers.push(questionData.correct_answer);
        questionData.incorrect_answers.sort();

        questionData.incorrect_answers.forEach(answer => {
            const button = document.createElement('button');
            button.textContent = answer;
            button.classList.add('option');
            button.addEventListener('click', selectOption);
            optionsElement.appendChild(button);
        });

        lockBtn.classList.remove('hidden');
        nextBtn.classList.remove('hidden');
    }

    function resetState() {
        clearInterval(timer);
        timerElement.textContent = '15s';
        selectedOption = null;
        messageElement.classList.add('hidden');
        optionsElement.innerHTML = '';
        lockBtn.classList.add('hidden');
        nextBtn.classList.add('hidden');
    }

    function selectOption(e) {
        if (selectedOption) {
            selectedOption.classList.remove('selected');
        }
        selectedOption = e.target;
        selectedOption.classList.add('selected');
    }

    function lockAnswer() {
        if (!selectedOption) {
            unsolvedCount++;
            unsolvedScoreElement.textContent = `Unsolved: ${unsolvedCount}`;
        } else {
            const isCorrect = selectedOption.textContent === questions[currentQuestionIndex].correct_answer;
            if (isCorrect) {
                correctCount++;
                messageElement.textContent = 'Correct';
                correctScoreElement.textContent = `Correct: ${correctCount}`;
            } else {
                incorrectCount++;
                messageElement.textContent = 'Incorrect';
                incorrectScoreElement.textContent = `Incorrect: ${incorrectCount}`;
            }
            messageElement.classList.remove('hidden');
        }
        lockBtn.classList.add('hidden');
    }

    function nextQuestion() {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
            startTimer();
        } else {
            showResults();
        }
    }

    function startTimer() {
        let timeLeft = 15;
        timer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = `${timeLeft}s`;
            if (timeLeft <= 0) {
                clearInterval(timer);
                lockAnswer();
            }
        }, 1000);
    }

    function showResults() {
        questionContainer.innerHTML = `<h2>Quiz Complete!</h2>`;
        exitBtn.textContent = 'Exit';
    }

    function exitQuiz() {
        window.location.reload();
    }
});
