
// Quiz Questions and Answers
const quizData = [
    {
        question: "What is the capital of Japan?",
        options: ["Beijing", "Seoul", "Tokyo", "Bangkok"],
        correctAnswer: "Tokyo"
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter", "Venus"],
        correctAnswer: "Mars"
    },
    {
        question: "What is the largest mammal in the world?",
        options: ["Elephant", "Giraffe", "Blue Whale", "Polar Bear"],
        correctAnswer: "Blue Whale"
    },
    {
        question: "Which element has the chemical symbol 'O'?",
        options: ["Oxygen", "Gold", "Silver", "Iron"],
        correctAnswer: "Oxygen"
    },
    {
        question: "In which year did World War II end?",
        options: ["1943", "1945", "1947", "1950"],
        correctAnswer: "1945"
    },
    {
        question: "Who wrote 'Romeo and Juliet'?",
        options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
        correctAnswer: "William Shakespeare"
    },
    {
        question: "What is the largest organ in the human body?",
        options: ["Heart", "Brain", "Liver", "Skin"],
        correctAnswer: "Skin"
    },
    {
        question: "Which country is home to the Great Barrier Reef?",
        options: ["Brazil", "Australia", "Mexico", "Thailand"],
        correctAnswer: "Australia"
    },
    {
        question: "What is the main component of the Sun?",
        options: ["Hydrogen", "Oxygen", "Carbon", "Helium"],
        correctAnswer: "Hydrogen"
    },
    {
        question: "Which famous scientist developed the theory of relativity?",
        options: ["Isaac Newton", "Marie Curie", "Albert Einstein", "Galileo Galilei"],
        correctAnswer: "Albert Einstein"
    }
];

// Elements
const questionContainer = document.getElementById('question-container');
const resultContainer = document.getElementById('result-container');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const currentQuestionElem = document.getElementById('current');
const totalQuestionsElem = document.getElementById('total');
const scoreElem = document.getElementById('score');
const finalScoreElem = document.getElementById('final-score');
const resultMessageElem = document.getElementById('result-message');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const submitButton = document.getElementById('submit-button');
const restartButton = document.getElementById('restart-button');
const progressBar = document.getElementById('progress-bar');

// Variables
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = Array(quizData.length).fill(null);
let questionsAnswered = 0;

// Initialize Quiz
function initQuiz() {
    // Set total questions display
    totalQuestionsElem.textContent = quizData.length;

    // Reset variables
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = Array(quizData.length).fill(null);
    questionsAnswered = 0;

    // Show first question
    showQuestion(currentQuestionIndex);

    // Update UI
    updateUI();
}

// Show Question
function showQuestion(index) {
    const question = quizData[index];
    questionText.textContent = question.question;

    // Clear previous options
    optionsContainer.innerHTML = '';

    // Create option elements
    question.options.forEach((option, i) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option');

        const correctAnswer = quizData[index].correctAnswer;

        // If user has answered this question, apply appropriate styling
        if (userAnswers[index] === option) {
            optionElement.classList.add('selected');

            // Show correct/incorrect styling for previously answered questions
            if (option === correctAnswer) {
                optionElement.classList.add('correct');
            } else {
                optionElement.classList.add('incorrect');
            }
        }

        // If user selected an incorrect answer, show the correct answer
        if (userAnswers[index] !== null && userAnswers[index] !== correctAnswer && option === correctAnswer) {
            optionElement.classList.add('correct');
        }

        const prefix = document.createElement('div');
        prefix.classList.add('option-prefix');
        prefix.textContent = String.fromCharCode(65 + i); // A, B, C, D

        const optionText = document.createElement('span');
        optionText.textContent = option;

        optionElement.appendChild(prefix);
        optionElement.appendChild(optionText);

        // Add click event to select option
        optionElement.addEventListener('click', () => selectOption(option));

        optionsContainer.appendChild(optionElement);
    });

    // Update current question display
    currentQuestionElem.textContent = index + 1;

    // Update progress bar
    updateProgressBar();
}

// Select Option
function selectOption(selectedOption) {
    // Remove selected class from all options
    const options = optionsContainer.querySelectorAll('.option');
    options.forEach(option => {
        option.classList.remove('selected');
        option.classList.remove('correct');
        option.classList.remove('incorrect');
    });

    // Add selected class to chosen option
    const selectedOptionElement = Array.from(options).find(
        option => option.textContent.includes(selectedOption)
    );
    selectedOptionElement.classList.add('selected');

    // Check if the answer is correct
    const correctAnswer = quizData[currentQuestionIndex].correctAnswer;
    const isCorrect = selectedOption === correctAnswer;

    // Show immediate feedback
    if (isCorrect) {
        selectedOptionElement.classList.add('correct');
        selectedOptionElement.classList.add('pulse');
        // Only update score if this is the first correct answer for this question
        if (userAnswers[currentQuestionIndex] !== correctAnswer) {
            score++;
            scoreElem.textContent = score; // Update score display immediately
        }
    } else {
        selectedOptionElement.classList.add('incorrect');
        selectedOptionElement.classList.add('shake');

        // Highlight the correct answer
        const correctOptionElement = Array.from(options).find(
            option => option.textContent.includes(correctAnswer)
        );
        correctOptionElement.classList.add('correct');
    }

    // Remove animation classes after animation completes
    setTimeout(() => {
        selectedOptionElement.classList.remove('pulse');
        selectedOptionElement.classList.remove('shake');
    }, 500);

    // Update user's answer
    if (userAnswers[currentQuestionIndex] === null) {
        questionsAnswered++;
    }
    userAnswers[currentQuestionIndex] = selectedOption;

    // Update UI
    updateUI();
}

// Update UI based on current state
function updateUI() {
    // Update score display
    scoreElem.textContent = calculateScore();

    // Enable/disable Previous button
    prevButton.disabled = currentQuestionIndex === 0;

    // Show Submit button on last question, otherwise show Next button
    if (currentQuestionIndex === quizData.length - 1) {
        nextButton.classList.add('hidden');
        submitButton.classList.remove('hidden');
    } else {
        nextButton.classList.remove('hidden');
        submitButton.classList.add('hidden');
    }

    // Enable/disable Submit button based on whether all questions are answered
    submitButton.disabled = questionsAnswered !== quizData.length;
}

// Navigate to next question
function nextQuestion() {
    if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        showQuestion(currentQuestionIndex);
    }
}

// Navigate to previous question
function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion(currentQuestionIndex);
    }
}

// Calculate current score
function calculateScore() {
    score = 0;
    userAnswers.forEach((answer, index) => {
        if (answer === quizData[index].correctAnswer) {
            score++;
        }
    });
    return score;
}

// Submit Quiz
function submitQuiz() {
    // Hide question container and show result container
    questionContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');

    // Update final score display
    finalScoreElem.textContent = score;

    // Generate result message based on score
    let message = '';
    const percentage = (score / quizData.length) * 100;

    if (percentage >= 90) {
        message = 'Outstanding! You\'re a quiz master!';
    } else if (percentage >= 70) {
        message = 'Great job! You know your stuff!';
    } else if (percentage >= 50) {
        message = 'Not bad! A bit more study and you\'ll ace it!';
    } else {
        message = 'Keep learning! You\'ll do better next time!';
    }

    resultMessageElem.textContent = message;

    // Hide navigation buttons
    prevButton.classList.add('hidden');
    nextButton.classList.add('hidden');
    submitButton.classList.add('hidden');
}

// Restart Quiz
function restartQuiz() {
    // Show question container and hide result container
    questionContainer.classList.remove('hidden');
    resultContainer.classList.add('hidden');

    // Show navigation buttons
    prevButton.classList.remove('hidden');

    // Initialize quiz
    initQuiz();
}

// Update progress bar
function updateProgressBar() {
    const progress = ((currentQuestionIndex + 1) / quizData.length) * 100;
    progressBar.style.width = `${progress}%`;
}

// Event Listeners
nextButton.addEventListener('click', nextQuestion);
prevButton.addEventListener('click', prevQuestion);
submitButton.addEventListener('click', submitQuiz);
restartButton.addEventListener('click', restartQuiz);

// Initialize the quiz
initQuiz();
