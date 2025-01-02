function selectTab(tabName) {
    var tabs = document.getElementsByClassName("content");
    for (var i = 0; i < tabs.length; i++) {
        tabs[i].style.display = "none";
    }
    document.getElementById(tabName).style.display = "block";
}
let currentTest = 1;

function showTest(testNumber) {
    const tests = document.querySelectorAll('.quiz-section');
    tests.forEach(test => test.style.display = 'none');
    document.getElementById(`test${testNumber}`).style.display = 'block';
}

function nextTest() {
    if (currentTest < 10) {
        currentTest++;
        showTest(currentTest);
    }
}

function previousTest() {
    if (currentTest > 1) {
        currentTest--;
        showTest(currentTest);
    }
}

function submitQuiz() {
    const answers = {
        q1: 'a',
        q2: 'b',
        q3: 'a',
        q4: 'a',
        q5: 'a',
        q6: 'a',
        q7: 'b',
        q8: 'a',
        q9: 'a',
        q10: 'a'
    };

    let score = 0;
    for (let i = 1; i <= 10; i++) {
        const selected = document.querySelector(`input[name="q${i}"]:checked`);
        if (selected && selected.value === answers[`q${i}`]) {
            score++;
        }
    }

    const resultText = `You scored ${score} out of 10!`;
    document.getElementById('quiz-results-text').innerText = resultText;
    document.getElementById('quiz-results-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('quiz-results-modal').style.display = 'none';
}

// Show the first test on page load
window.onload = function() {
    showTest(1);
};