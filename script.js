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
const startContainer = document.getElementById('start-container');
const questionContainer = document.getElementById('question-container');
const resultContainer = document.getElementById('result-container');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const currentQuestionElem = document.getElementById('current');
const totalQuestionsElem = document.getElementById('total');
const scoreElem = document.getElementById('score');
const finalScoreElem = document.getElementById('final-score');
const resultMessageElem = document.getElementById('result-message');
const questionsReviewContainer = document.getElementById('questions-review');
const restartButton = document.getElementById('restart-button');
const startButton = document.getElementById('start-button');
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
    
    // Hide question container, show start screen
    questionContainer.classList.add('hidden');
    resultContainer.classList.add('hidden');
    startContainer.classList.remove('hidden');
    
    // Reset progress bar
    progressBar.style.width = '0%';
    
    // Update score display
    scoreElem.textContent = '0';
}

// Start the quiz when start button is clicked
function startQuiz() {
    startContainer.classList.add('hidden');
    questionContainer.classList.remove('hidden');
    showQuestion(0);
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
    // If this question was already answered, don't do anything
    if (userAnswers[currentQuestionIndex] !== null) {
        return;
    }
    
    // Add selected class to chosen option
    const options = optionsContainer.querySelectorAll('.option');
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
        score++;
        scoreElem.textContent = score; // Update score display immediately
    } else {
        selectedOptionElement.classList.add('incorrect');
        selectedOptionElement.classList.add('shake');
        
        // Highlight the correct answer
        const correctOptionElement = Array.from(options).find(
            option => option.textContent.includes(correctAnswer)
        );
        correctOptionElement.classList.add('correct');
    }
    
    // Update user's answer
    userAnswers[currentQuestionIndex] = selectedOption;
    questionsAnswered++;
    
    // Wait for animation to complete, then move to next question automatically
    setTimeout(() => {
        if (currentQuestionIndex < quizData.length - 1) {
            currentQuestionIndex++;
            showQuestion(currentQuestionIndex);
        } else {
            submitQuiz();
        }
    }, 1500); // Give user 1.5 seconds to see the result before moving on
}

// Update progress bar
function updateProgressBar() {
    const progress = ((currentQuestionIndex + 1) / quizData.length) * 100;
    progressBar.style.width = `${progress}%`;
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

// Create detailed review of all questions
function createQuestionsReview() {
    questionsReviewContainer.innerHTML = '';
    
    quizData.forEach((question, index) => {
        // Create question review item
        const reviewItem = document.createElement('div');
        reviewItem.classList.add('question-review-item');
        
        // Create question status indicator (green/red dot)
        const statusIndicator = document.createElement('div');
        statusIndicator.classList.add('question-status');
        
        const isCorrect = userAnswers[index] === question.correctAnswer;
        if (isCorrect) {
            statusIndicator.classList.add('correct');
        } else {
            statusIndicator.classList.add('incorrect');
        }
        
        // Create question title
        const questionTitle = document.createElement('div');
        questionTitle.classList.add('question-review-title');
        questionTitle.textContent = `Q${index + 1}: ${question.question}`;
        
        // Create answer detail
        const answerDetail = document.createElement('div');
        answerDetail.classList.add('answer-detail');
        
        // User's answer
        const userAnswerDiv = document.createElement('div');
        userAnswerDiv.classList.add('user-answer');
        if (isCorrect) {
            userAnswerDiv.classList.add('correct');
        }
        userAnswerDiv.innerHTML = `<strong>Your Answer:</strong> ${userAnswers[index]}`;
        
        // Correct answer (only show if user was wrong)
        const correctAnswerDiv = document.createElement('div');
        correctAnswerDiv.classList.add('correct-answer');
        correctAnswerDiv.innerHTML = `<strong>Correct Answer:</strong> ${question.correctAnswer}`;
        
        // Assemble the review item
        answerDetail.appendChild(userAnswerDiv);
        
        // Only show "Correct Answer" section if the user got it wrong
        if (!isCorrect) {
            answerDetail.appendChild(correctAnswerDiv);
        }
        
        reviewItem.appendChild(statusIndicator);
        reviewItem.appendChild(questionTitle);
        reviewItem.appendChild(answerDetail);
        
        // Add the review item to the container
        questionsReviewContainer.appendChild(reviewItem);
    });
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
    
    // Create the detailed questions review
    createQuestionsReview();
}

// Restart Quiz
function restartQuiz() {
    initQuiz();
}

// Event Listeners
startButton.addEventListener('click', startQuiz);
restartButton.addEventListener('click', restartQuiz);

// Initialize the quiz
initQuiz();