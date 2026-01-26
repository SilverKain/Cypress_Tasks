// Quiz Engine for English Learning Course
// Универсальный движок для тестов

class QuizEngine {
    constructor(quizData) {
        this.quizData = quizData;
        this.currentAnswers = {};
        this.submitted = false;
        this.init();
    }

    init() {
        this.renderQuiz();
        this.attachEventListeners();
    }

    renderQuiz() {
        const container = document.getElementById('quiz-container');
        
        // Render header
        const header = `
            <div class="quiz-header">
                <h1>${this.quizData.title}</h1>
                <p>${this.quizData.description}</p>
            </div>
        `;

        // Render questions
        let questionsHTML = '<div class="quiz-content">';
        questionsHTML += '<div class="progress-bar"><div class="progress-fill" id="progress-fill"></div></div>';
        
        this.quizData.questions.forEach((q, index) => {
            questionsHTML += this.renderQuestion(q, index);
        });

        questionsHTML += `
            <button class="submit-btn" id="submit-btn">
                ${this.quizData.submitText || 'Проверить ответы'}
            </button>
            <div class="results" id="results"></div>
        </div>`;

        container.innerHTML = header + questionsHTML;
    }

    renderQuestion(question, index) {
        let html = `
            <div class="question-container" data-question="${index}">
                <span class="question-number">Вопрос ${index + 1}</span>
                <div class="question-text">${question.question}</div>
        `;

        if (question.translation) {
            html += `<div class="question-translation">${question.translation}</div>`;
        }

        html += '<div class="options">';

        question.options.forEach((option, optIndex) => {
            const optionId = `q${index}_opt${optIndex}`;
            html += `
                <div class="option" data-option="${optIndex}">
                    <input type="radio" 
                           id="${optionId}" 
                           name="question${index}" 
                           value="${optIndex}">
                    <label for="${optionId}">${option.text}</label>
                </div>
            `;
        });

        html += '</div>';

        if (question.explanation) {
            html += `
                <div class="explanation" id="explanation${index}">
                    <strong>Объяснение:</strong> ${question.explanation}
                </div>
            `;
        }

        html += '</div>';
        return html;
    }

    attachEventListeners() {
        // Option selection
        document.querySelectorAll('.option').forEach(option => {
            option.addEventListener('click', (e) => {
                if (this.submitted) return;
                
                const radio = option.querySelector('input[type="radio"]');
                radio.checked = true;
                
                // Update selection styling
                const questionContainer = option.closest('.question-container');
                questionContainer.querySelectorAll('.option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                option.classList.add('selected');
                
                // Store answer
                const questionIndex = questionContainer.dataset.question;
                const optionIndex = option.dataset.option;
                this.currentAnswers[questionIndex] = parseInt(optionIndex);
                
                this.updateProgress();
            });
        });

        // Submit button
        document.getElementById('submit-btn').addEventListener('click', () => {
            this.submitQuiz();
        });
    }

    updateProgress() {
        const totalQuestions = this.quizData.questions.length;
        const answeredQuestions = Object.keys(this.currentAnswers).length;
        const progress = (answeredQuestions / totalQuestions) * 100;
        
        document.getElementById('progress-fill').style.width = `${progress}%`;
        
        // Enable submit button when all answered
        const submitBtn = document.getElementById('submit-btn');
        if (answeredQuestions === totalQuestions) {
            submitBtn.disabled = false;
        }
    }

    submitQuiz() {
        if (this.submitted) return;
        
        const totalQuestions = this.quizData.questions.length;
        const answeredQuestions = Object.keys(this.currentAnswers).length;
        
        if (answeredQuestions < totalQuestions) {
            alert('Пожалуйста, ответьте на все вопросы!');
            return;
        }

        this.submitted = true;
        let correctCount = 0;

        // Check answers
        this.quizData.questions.forEach((question, qIndex) => {
            const userAnswer = this.currentAnswers[qIndex];
            const correctAnswer = question.correctAnswer;
            const questionContainer = document.querySelector(`[data-question="${qIndex}"]`);
            const options = questionContainer.querySelectorAll('.option');

            options.forEach((option, optIndex) => {
                const radio = option.querySelector('input[type="radio"]');
                radio.disabled = true;

                if (optIndex === correctAnswer) {
                    option.classList.add('correct');
                }

                if (optIndex === userAnswer && userAnswer !== correctAnswer) {
                    option.classList.add('incorrect');
                }
            });

            if (userAnswer === correctAnswer) {
                correctCount++;
            }

            // Show explanation
            if (question.explanation) {
                const explanation = document.getElementById(`explanation${qIndex}`);
                if (explanation) {
                    explanation.classList.add('show');
                }
            }
        });

        this.showResults(correctCount, totalQuestions);
    }

    showResults(correctCount, totalQuestions) {
        const percentage = Math.round((correctCount / totalQuestions) * 100);
        const resultsDiv = document.getElementById('results');
        
        let rating = '';
        let message = '';
        
        if (percentage >= 90) {
            rating = '⭐⭐⭐';
            message = 'Отлично! Превосходный результат!';
        } else if (percentage >= 75) {
            rating = '⭐⭐';
            message = 'Очень хорошо! Продолжайте в том же духе!';
        } else if (percentage >= 60) {
            rating = '⭐';
            message = 'Хорошо! Есть что улучшить.';
        } else {
            rating = '📚';
            message = 'Нужно больше практики. Не сдавайтесь!';
        }

        resultsDiv.innerHTML = `
            <div class="score">${correctCount}/${totalQuestions}</div>
            <div class="score-message">${message}</div>
            <div class="score-details">Правильных ответов: ${percentage}%</div>
            <div class="rating">${rating}</div>
            <button class="retry-btn" onclick="location.reload()">
                Пройти снова
            </button>
        `;
        
        resultsDiv.classList.add('show');
        
        // Scroll to results
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Disable submit button
        document.getElementById('submit-btn').disabled = true;
        document.getElementById('submit-btn').textContent = 'Тест завершён';
    }
}

// Initialize quiz when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (typeof quizData !== 'undefined') {
        try {
            new QuizEngine(quizData);
        } catch (error) {
            console.error('Error initializing quiz:', error);
            const container = document.getElementById('quiz-container');
            if (container) {
                container.innerHTML = `
                    <div style="padding: 20px; text-align: center; color: #e74c3c;">
                        <h2>⚠️ Ошибка загрузки теста</h2>
                        <p>Пожалуйста, попробуйте:</p>
                        <ul style="list-style: none; padding: 0;">
                            <li>• Обновить страницу</li>
                            <li>• Открыть в другом браузере</li>
                            <li>• Проверить интернет-соединение</li>
                        </ul>
                        <p style="font-size: 0.9em; color: #7f8c8d;">Ошибка: ${error.message}</p>
                    </div>
                `;
            }
        }
    } else {
        console.error('Quiz data not found. Please include quiz data before this script.');
        const container = document.getElementById('quiz-container');
        if (container) {
            container.innerHTML = `
                <div style="padding: 20px; text-align: center; color: #e74c3c;">
                    <h2>⚠️ Данные теста не найдены</h2>
                    <p>Файл теста поврежден или не загрузился полностью.</p>
                </div>
            `;
        }
    }
});
