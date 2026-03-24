// AI Study Assistant - Flashcard UI Component
// Issue #2: Build flashcard UI component

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
    
    // Show loading
    if (loading) loading.style.display = 'block';
    if (container) container.style.display = 'none';
    
    try {
        console.log(`Generating flashcards for: ${topic}`);
        
        // Mock flashcards for testing UI
        // Week 12: This will connect to /generate-flashcards API
        currentFlashcards = [
            { question: `What is ${topic}?`, answer: `${topic} is a fascinating subject that helps us understand the world better.` },
            { question: `Why is ${topic} important?`, answer: `Understanding ${topic} helps in many real-world applications and critical thinking.` },
            { question: `What are the key concepts of ${topic}?`, answer: `Key concepts include fundamentals, principles, and practical applications.` },
            { question: `How can you learn more about ${topic}?`, answer: `You can explore books, online courses, and hands-on practice.` },
            { question: `What are common challenges in ${topic}?`, answer: `Common challenges include complexity, practice requirements, and staying updated.` }
        ];
        
        currentCardIndex = 0;
        displayCurrentCard();
        
        // Show container
        if (container) container.style.display = 'block';
        
        // Enable controls
        updateCardControls();
        
    } catch (error) {
        console.error('Error generating flashcards:', error);
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