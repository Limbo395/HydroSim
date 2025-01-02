let currentQuestion = 1;
const totalQuestions = 9;
let timer;
let timeLeft = 900; // 15 minutes in seconds

// Initialize quiz when switching to tests tab
function initializeQuiz() {
    if (document.getElementById('tests').style.display !== 'none') {
        startQuiz();
    }
}

function startQuiz() {
    currentQuestion = 1;
    timeLeft = 900;
    updateProgress();
    startTimer();
    showCurrentQuestion();
}

function startTimer() {
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
            clearInterval(timer);
            submitQuiz();
        }
    }, 1000);
}

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const timerElement = document.querySelector('.quiz-timer');
    if (timerElement) {
        timerElement.textContent = 
            `Time remaining: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}

function updateProgress() {
    const progressBar = document.querySelector('.quiz-progress-bar');
    const counter = document.querySelector('.quiz-counter');
    if (progressBar && counter) {
        const progress = ((currentQuestion - 1) / totalQuestions) * 100;
        progressBar.style.width = `${progress}%`;
        counter.textContent = `Question ${currentQuestion} of ${totalQuestions}`;
    }
}

function showCurrentQuestion() {
    // Hide all questions
    document.querySelectorAll('.quiz-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show current question
    const currentSection = document.getElementById(`test${currentQuestion}`);
    if (currentSection) {
        currentSection.style.display = 'block';
    }
    
    // Update navigation buttons
    updateNavigationButtons();
}

function updateNavigationButtons() {
    const prevBtn = document.querySelector('.quiz-btn.prev');
    const nextBtn = document.querySelector('.quiz-btn.next');
    
    if (prevBtn) prevBtn.disabled = currentQuestion === 1;
    if (nextBtn) nextBtn.disabled = currentQuestion === totalQuestions;
}

function nextQuestion() {
    if (currentQuestion < totalQuestions) {
        currentQuestion++;
        showCurrentQuestion();
        updateProgress();
        animateTransition('next');
    }
}

function prevQuestion() {
    if (currentQuestion > 1) {
        currentQuestion--;
        showCurrentQuestion();
        updateProgress();
        animateTransition('prev');
    }
}

function animateTransition(direction) {
    const currentSection = document.getElementById(`test${currentQuestion}`);
    if (currentSection) {
        currentSection.style.opacity = '0';
        currentSection.style.transform = direction === 'next' ? 'translateX(20px)' : 'translateX(-20px)';
        
        setTimeout(() => {
            currentSection.style.opacity = '1';
            currentSection.style.transform = 'translateX(0)';
        }, 50);
    }
}

function submitQuiz() {
    clearInterval(timer);
    
    const answers = [];
    for (let i = 1; i <= totalQuestions; i++) {
        const selectedOption = document.querySelector(`input[name="q${i}"]:checked`);
        answers.push(selectedOption ? selectedOption.value : null);
    }
    
    const score = calculateScore(answers);
    showResults(score);
}

function calculateScore(answers) {
    const correctAnswers = ['a', 'a', 'b', 'c', 'a', 'b', 'c', 'a', 'b'];
    return answers.reduce((score, answer, index) => {
        return score + (answer === correctAnswers[index] ? 1 : 0);
    }, 0);
}

function showResults(score) {
    const percentage = Math.round((score / totalQuestions) * 100);
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Quiz Results</h2>
            <div class="results-content">
                <div class="score-circle">
                    <div class="score-number">${percentage}%</div>
                    <div class="score-text">Score</div>
                </div>
                <p>You got ${score} out of ${totalQuestions} questions correct!</p>
                <button onclick="restartQuiz()" class="quiz-btn next">Try Again</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 50);
}

function restartQuiz() {
    const modal = document.querySelector('.modal');
    if (modal) modal.remove();
    
    document.querySelectorAll('input[type="radio"]').forEach(input => {
        input.checked = false;
    });
    
    startQuiz();
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize quiz if we're on the tests tab
    initializeQuiz();
    
    // Add tab change listener
    const testsTab = document.querySelector('.tab[onclick="selectTab(\'tests\')"]');
    if (testsTab) {
        const originalOnClick = testsTab.onclick;
        testsTab.onclick = (e) => {
            originalOnClick(e);
            setTimeout(initializeQuiz, 100);
        };
    }
});
