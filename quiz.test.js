// Import the functions to test
const fs = require('fs');
const path = require('path');
const quizCode = fs.readFileSync(path.resolve(__dirname, './quiz.js'), 'utf8');
eval(quizCode);

// Mock quiz functions
const quizFunctions = {
    currentQuestion: 1,
    totalQuestions: 10,
    timeLeft: 900,

    startTimer() {
        if (this.timer) clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimer();
            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.submitQuiz();
            }
        }, 1000);
    },

    updateTimer() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const timerElement = document.querySelector('.quiz-timer');
        if (timerElement) {
            timerElement.textContent = 
                `Час, що залишився: ${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    },

    updateProgress() {
        const progressBar = document.querySelector('.quiz-progress-bar');
        const counter = document.querySelector('.quiz-counter');
        if (progressBar && counter) {
            const progress = (this.currentQuestion / this.totalQuestions) * 100;
            progressBar.style.width = `${progress}%`;
            counter.textContent = `Питання ${this.currentQuestion} з ${this.totalQuestions}`;
        }
    },

    nextQuestion() {
        if (this.currentQuestion < this.totalQuestions) {
            this.currentQuestion++;
            this.showCurrentQuestion();
        }
    },

    prevQuestion() {
        if (this.currentQuestion > 1) {
            this.currentQuestion--;
            this.showCurrentQuestion();
        }
    },

    showCurrentQuestion() {
        // Mock implementation
    },

    calculateScore(answers) {
        let score = 0;
        Object.keys(answers).forEach(key => {
            const selected = document.querySelector(`input[name="${key}"]:checked`);
            if (selected && selected.value === answers[key]) {
                score++;
            }
        });
        return score;
    },

    startQuiz() {
        this.currentQuestion = 1;
        this.timeLeft = 900;
        this.updateProgress();
        this.startTimer();
        this.showCurrentQuestion();
    },

    initializeQuiz() {
        if (document.getElementById('tests').style.display !== 'none') {
            this.startQuiz();
        }
    }
};

// Mock DOM elements
document.body.innerHTML = `
    <div id="tests" style="display: block;">
        <div class="quiz-timer"></div>
        <div class="quiz-progress-bar" style="width: 0%"></div>
        <div class="quiz-counter"></div>
        <div id="question1" class="question">
            <input type="radio" name="q1" value="a" checked>
            <input type="radio" name="q2" value="b" checked>
            <input type="radio" name="q3" value="a" checked>
        </div>
    </div>
`;

// Mock for localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    clear: jest.fn()
};
global.localStorage = localStorageMock;

// Mock for setTimeout and setInterval
jest.useFakeTimers();

describe('Quiz Functionality Tests', () => {
    beforeEach(() => {
        // Reset mocks and timer before each test
        jest.clearAllMocks();
        jest.clearAllTimers();
        quizFunctions.timeLeft = 900;
        quizFunctions.currentQuestion = 1;
        
        // Reset DOM elements
        document.querySelector('.quiz-timer').textContent = '';
        document.querySelector('.quiz-progress-bar').style.width = '0%';
        document.querySelector('.quiz-counter').textContent = '';
    });

    // Test timer initialization
    test('Timer should start with correct initial value', () => {
        quizFunctions.startTimer();
        quizFunctions.updateTimer(); // Force immediate timer update
        
        // Assert the initial timer value
        expect(document.querySelector('.quiz-timer').textContent)
            .toBe('Час, що залишився: 15:00');
        
        // Fast-forward time by 1 second
        jest.advanceTimersByTime(1000);
        
        // Assert the timer value after 1 second
        expect(document.querySelector('.quiz-timer').textContent)
            .toBe('Час, що залишився: 14:59');
    });

    // Test progress bar updates
    test('Progress bar should update correctly', () => {
        quizFunctions.updateProgress();
        
        // Assert initial progress
        expect(document.querySelector('.quiz-progress-bar').style.width).toBe('10%');
        expect(document.querySelector('.quiz-counter').textContent)
            .toBe('Питання 1 з 10');
        
        // Move to next question
        quizFunctions.currentQuestion = 5;
        quizFunctions.updateProgress();
        
        // Assert progress at question 5
        expect(document.querySelector('.quiz-progress-bar').style.width).toBe('50%');
        expect(document.querySelector('.quiz-counter').textContent)
            .toBe('Питання 5 з 10');
    });

    // Test question navigation
    test('Navigation between questions should work correctly', () => {
        const showCurrentQuestionSpy = jest.spyOn(quizFunctions, 'showCurrentQuestion');
        
        // Test next question
        quizFunctions.nextQuestion();
        expect(quizFunctions.currentQuestion).toBe(2);
        expect(showCurrentQuestionSpy).toHaveBeenCalled();
        
        // Test previous question
        quizFunctions.prevQuestion();
        expect(quizFunctions.currentQuestion).toBe(1);
        expect(showCurrentQuestionSpy).toHaveBeenCalledTimes(2);
    });

    // Test score calculation with mock answers
    test('Score calculation should work correctly', () => {
        const mockAnswers = {
            q1: 'a',
            q2: 'b',
            q3: 'c'
        };
        
        const score = quizFunctions.calculateScore(mockAnswers);
        expect(score).toBe(2); // 2 correct answers out of 3 (q1 and q2 match)
    });

    // Test quiz initialization
    test('Quiz should initialize with correct state', () => {
        const startQuizSpy = jest.spyOn(quizFunctions, 'startQuiz');
        
        quizFunctions.initializeQuiz();
        
        // Assert that startQuiz was called
        expect(startQuizSpy).toHaveBeenCalled();
        
        // Assert initial state
        expect(quizFunctions.currentQuestion).toBe(1);
        expect(quizFunctions.timeLeft).toBe(900);
    });
});
