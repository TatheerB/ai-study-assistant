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

let quizQuestions = [];
let userChoices = [];

// Initialize quiz page
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
 
        const options = Array.isArray(q.options) ? q.options : [];
        for (let j = 0; j < options.length; j++) {
            const optionText = options[j]
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/'/g, "&#39;")
                .replace(/"/g, "&quot;");
            html += `
                <div class="option">
                    <input type="radio" name="q${i}" value="${j}" id="q${i}_opt${j}">
                    <label for="q${i}_opt${j}">${optionText}</label>
                </div>
            `;
        }
        html += `</div>`;
    }
 
    container.innerHTML = html;
 
    for (let i = 0; i < quizQuestions.length; i++) {
        const questionIndex = i;
        const radios = document.querySelectorAll(`input[name="q${questionIndex}"]`);
        for (let j = 0; j < radios.length; j++) {
            radios[j].addEventListener('change', function() {
                userChoices[questionIndex] = parseInt(this.value);
            });
        }
    }
}
 
function calculateScore() {
    for (let i = 0; i < userChoices.length; i++) {
        if (userChoices[i] === null) {
            alert(`Please answer question ${i + 1}`);
            return;
        }
    }
 
    let correct = 0;
    for (let i = 0; i < quizQuestions.length; i++) {
        if (userChoices[i] === quizQuestions[i].correct) {
            correct++;
        }
    }
 
    const percentage = Math.round((correct / quizQuestions.length) * 100);
 
    const resultsDiv = document.getElementById('quiz-results');
    resultsDiv.innerHTML = `
        <strong>Your Score: ${correct}/${quizQuestions.length} (${percentage}%)</strong><br>
        ${percentage >= 70 ? 'Great job! Keep practicing!' : 'Keep studying! Try again!'}
    `;
    resultsDiv.style.display = 'block';
 
    document.getElementById('submit-quiz').disabled = true;
}

// ==================== SUMMARY FUNCTIONALITY ====================

document.addEventListener('DOMContentLoaded', function() {
    initSummaryPage();
    initHistoryPage();
});

let currentSummaryTopic = '';
let currentSummaryText = '';

function initSummaryPage() {
    const summaryForm = document.getElementById('summary-form');
    if (!summaryForm) return;

    summaryForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const topicInput = document.getElementById('topic');
        const topic = topicInput.value.trim();

        if (!topic) return;

        const loading = document.getElementById('summary-loading');
        const resultDiv = document.getElementById('summary-result');
        const summaryTextDiv = document.getElementById('summary-text');
        const saveMessage = document.getElementById('save-message');

        loading.style.display = 'block';
        resultDiv.style.display = 'none';
        saveMessage.innerHTML = '';

        try {
            const response = await fetch('/generate-summary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ topic: topic })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate summary');
            }

            currentSummaryTopic = data.topic;
            currentSummaryText = data.summary;

            summaryTextDiv.innerText = data.summary;
            resultDiv.style.display = 'block';
        } catch (error) {
            summaryTextDiv.innerText = error.message;
            resultDiv.style.display = 'block';
        } finally {
            loading.style.display = 'none';
        }
    });

    const saveBtn = document.getElementById('save-summary-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveCurrentSummary);
    }
}

async function saveCurrentSummary() {
    const saveMessage = document.getElementById('save-message');

    if (!currentSummaryTopic || !currentSummaryText) {
        saveMessage.innerHTML = '<p style="color:red;">No summary to save.</p>';
        return;
    }

    try {
        const response = await fetch('/save-study-set', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                topic: currentSummaryTopic,
                summary: currentSummaryText
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to save study set');
        }

        saveMessage.innerHTML = '<p style="color:green;">Study set saved successfully.</p>';
    } catch (error) {
        saveMessage.innerHTML = `<p style="color:red;">${error.message}</p>`;
    }
}


// ==================== HISTORY FUNCTIONALITY ====================

async function initHistoryPage() {
    const historyList = document.getElementById('history-list');
    if (!historyList) return;

    const loading = document.getElementById('history-loading');
    loading.style.display = 'block';

    try {
        const response = await fetch('/get-history');
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to load history');
        }

        if (!data.history || data.history.length === 0) {
            historyList.innerHTML = '<p>No study sets saved yet.</p>';
            return;
        }

        let html = '';
        data.history.forEach(item => {
            html += `
                <div class="question-card history-card">
                    <h3>${item.topic}</h3>
                    <p class="summary-preview" id="summary-${item.id}">
                        ${item.summary.length > 180 ? item.summary.substring(0, 180) + '...' : item.summary}
                    </p>
                    <button class="toggle-summary-btn" 
                            data-id="${item.id}" 
                            data-full="${encodeURIComponent(item.summary)}"
                            data-short="${encodeURIComponent(item.summary.length > 180 ? item.summary.substring(0, 180) + '...' : item.summary)}">
                        View More
                    </button>
                    <button class="submit-btn delete-btn" data-id="${item.id}" style="background:#c0392b; margin-top:1rem;">
                        Delete
                    </button>
                </div>
            `;
        });

        historyList.innerHTML = html;

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', async function() {
                const id = this.getAttribute('data-id');
                await deleteStudySet(id);
            });
        });

        document.querySelectorAll('.toggle-summary-btn').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const fullText = decodeURIComponent(this.getAttribute('data-full'));
                const shortText = decodeURIComponent(this.getAttribute('data-short'));
                const summaryElement = document.getElementById(`summary-${id}`);

                if (this.innerText === 'View More') {
                    summaryElement.innerText = fullText;
                    this.innerText = 'View Less';
                } else {
                    summaryElement.innerText = shortText;
                    this.innerText = 'View More';
                }
            });
});

    } catch (error) {
        historyList.innerHTML = `<p style="color:red;">${error.message}</p>`;
    } finally {
        loading.style.display = 'none';
    }
}

async function deleteStudySet(id) {
    try {
        const response = await fetch('/delete-study-set', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || data.message || 'Failed to delete study set');
        }

        location.reload();
    } catch (error) {
        alert(error.message);
    }
}