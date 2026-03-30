let currentFlashcards = [];
let currentCardIndex = 0;

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Flashcard UI loaded');
    initFlashcardsPage();
});

// ==================== FLASHCARDS FUNCTIONALITY ====================

function initFlashcardsPage() {
    const flashcardForm = document.getElementById('flashcard-form');
    if (flashcardForm) {
        flashcardForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const topic = document.getElementById('topic').value;
            if (topic) {
                await generateFlashcards(topic);
            }
        });
    }
    
    // Setup flashcard controls
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => navigateCard(-1));
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => navigateCard(1));
    }
    
    // Setup flashcard click to flip
    const flashcard = document.querySelector('.flashcard');
    if (flashcard) {
        flashcard.addEventListener('click', function() {
            this.classList.toggle('flipped');
        });
    }
}

async function generateFlashcards(topic) {
    const loading = document.getElementById('loading');
    const container = document.getElementById('flashcards-container');
    
    if (loading) loading.style.display = 'block';
    if (container) container.style.display = 'none';
    
    try {
        console.log(`Calling API for flashcards about: ${topic}`);
        
        const response = await fetch('/generate-flashcards', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ topic: topic })
        });
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        currentFlashcards = data.flashcards;
        currentCardIndex = 0;
        displayCurrentCard();
        
        if (container) container.style.display = 'block';
        updateCardControls();
        
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to generate flashcards. Please try again.');
    } finally {
        if (loading) loading.style.display = 'none';
    }
}

function displayCurrentCard() {
    if (!currentFlashcards.length) return;
    
    const card = currentFlashcards[currentCardIndex];
    const questionEl = document.getElementById('question-text');
    const answerEl = document.getElementById('answer-text');
    const counterEl = document.getElementById('card-counter');
    const flashcard = document.querySelector('.flashcard');
    
    if (questionEl) questionEl.textContent = card.question;
    if (answerEl) answerEl.textContent = card.answer;
    if (counterEl) counterEl.textContent = `Card ${currentCardIndex + 1} of ${currentFlashcards.length}`;
    
    // Reset flip state
    if (flashcard) flashcard.classList.remove('flipped');
}

function navigateCard(direction) {
    const newIndex = currentCardIndex + direction;
    if (newIndex >= 0 && newIndex < currentFlashcards.length) {
        currentCardIndex = newIndex;
        displayCurrentCard();
        updateCardControls();
    }
}

function updateCardControls() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    if (prevBtn) prevBtn.disabled = currentCardIndex === 0;
    if (nextBtn) nextBtn.disabled = currentCardIndex === currentFlashcards.length - 1;
}

// ==================== QUIZ FUNCTIONALITY ====================
// Issue #3: Build quiz UI component

let quizQuestions = [];
let userChoices = [];

// Initialize quiz page (this runs alongside flashcard init)
document.addEventListener('DOMContentLoaded', function() {
    console.log('Quiz page loaded');
    initQuizPage();
});

function initQuizPage() {
    const quizForm = document.getElementById('quiz-form');
    if (quizForm) {
        quizForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const topic = document.getElementById('topic').value;
            if (topic) {
                generateQuiz(topic);
            }
        });
    }
    
    const submitBtn = document.getElementById('submit-quiz');
    if (submitBtn) {
        submitBtn.addEventListener('click', calculateScore);
    }
}

async function generateQuiz(topic) {
    const loading = document.getElementById('loading');
    const container = document.getElementById('quiz-container');
    
    if (loading) loading.style.display = 'block';
    if (container) container.style.display = 'none';
    
    try {
        console.log(`Calling API for quiz about: ${topic}`);
        
        const response = await fetch('/generate-quiz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ topic: topic })
        });
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        // Store quiz data from API
        quizQuestions = data.quiz;
        userChoices = new Array(quizQuestions.length).fill(null);
        displayQuiz();
        
        if (container) container.style.display = 'block';
        
        const resultsDiv = document.getElementById('quiz-results');
        if (resultsDiv) resultsDiv.style.display = 'none';
        
        const submitBtn = document.getElementById('submit-quiz');
        if (submitBtn) submitBtn.disabled = false;
        
    } catch (error) {
        console.error('Error generating quiz:', error);
        alert('Failed to generate quiz. Please try again.');
    } finally {
        if (loading) loading.style.display = 'none';
    }
}

function displayQuiz() {
    const container = document.getElementById('questions-container');
    if (!container) return;
    
    let html = '';
    
    for (let i = 0; i < quizQuestions.length; i++) {
        const q = quizQuestions[i];
        html += `<div class="question-card">`;
        html += `<p class="question-text"><strong>${i + 1}. ${q.question}</strong></p>`;
        
        for (let j = 0; j < q.options.length; j++) {
            html += `
                <div class="option">
                    <input type="radio" name="q${i}" value="${j}">
                    <label>${q.options[j]}</label>
                </div>
            `;
        }
        html += `</div>`;
    }
    
    container.innerHTML = html;
    
    // Save answers when user selects
    for (let i = 0; i < quizQuestions.length; i++) {
        const radios = document.querySelectorAll(`input[name="q${i}"]`);
        for (let j = 0; j < radios.length; j++) {
            radios[j].addEventListener('change', function() {
                userChoices[i] = parseInt(this.value);
            });
        }
    }
}

function calculateScore() {
    // Check if all questions answered
    for (let i = 0; i < userChoices.length; i++) {
        if (userChoices[i] === null) {
            alert(`Please answer question ${i + 1}`);
            return;
        }
    }
    
    // Calculate score
    let correct = 0;
    for (let i = 0; i < quizQuestions.length; i++) {
        if (userChoices[i] === quizQuestions[i].correct) {
            correct++;
        }
    }
    
    const percentage = Math.round((correct / quizQuestions.length) * 100);
    
    // Show results
    const resultsDiv = document.getElementById('quiz-results');
    resultsDiv.innerHTML = `
        <strong>Your Score: ${correct}/${quizQuestions.length} (${percentage}%)</strong><br>
        ${percentage >= 70 ? 'Great job! Keep practicing!' : 'Keep studying! Try again!'}
    `;
    resultsDiv.style.display = 'block';
    
    // Disable submit button
    document.getElementById('submit-quiz').disabled = true;
}