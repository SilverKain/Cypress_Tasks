// Главный объект приложения
const AutomationTasksApp = {
    currentTask: 1,
    
    // Инициализация приложения
    init() {
        this.setupProgressBar();
        this.setupHintButtons();
        this.setupKeyboardNavigation();
        this.setupAnimations();
        this.loadProgress();
    },
    
    // Настройка прогресс бара
    setupProgressBar() {
        const progressSteps = document.querySelectorAll('.progress-step');
        
        progressSteps.forEach((step, index) => {
            step.addEventListener('click', () => {
                this.showTask(index + 1);
            });
        });
    },
    
    // Переключение между заданиями
    showTask(taskNumber) {
        // Скрыть все задания
        const allTasks = document.querySelectorAll('.task-card');
        const allSteps = document.querySelectorAll('.progress-step');
        
        allTasks.forEach(task => {
            task.classList.remove('active');
        });
        
        allSteps.forEach(step => {
            step.classList.remove('active');
        });
        
        // Показать выбранное задание
        const targetTask = document.getElementById(`task-${taskNumber}`);
        const targetStep = document.querySelector(`[data-task="${taskNumber}"]`);
        
        if (targetTask && targetStep) {
            targetTask.classList.add('active');
            targetStep.classList.add('active');
            this.currentTask = taskNumber;
            this.saveProgress();
            this.scrollToTop();
        }
    },
    
    // Настройка кнопок подсказок
    setupHintButtons() {
        // Глобальная функция для кнопок подсказок
        window.toggleHints = (taskId) => {
            const hints = document.getElementById(`${taskId}-hints`);
            const button = hints.previousElementSibling;
            
            if (hints.classList.contains('show')) {
                hints.classList.remove('show');
                button.textContent = '💡 Показать подсказки';
            } else {
                hints.classList.add('show');
                button.textContent = '🙈 Скрыть подсказки';
            }
        };
    },
    
    // Навигация с клавиатуры
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' && this.currentTask > 1) {
                this.showTask(this.currentTask - 1);
                e.preventDefault();
            } else if (e.key === 'ArrowRight' && this.currentTask < 3) {
                this.showTask(this.currentTask + 1);
                e.preventDefault();
            } else if (e.key === 'Escape') {
                this.hideAllHints();
                e.preventDefault();
            }
        });
    },
    
    // Анимации при прокрутке
    setupAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Наблюдаем за элементами
        const elementsToAnimate = document.querySelectorAll('.test-case, .resource-card');
        elementsToAnimate.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });
    },
    
    // Сохранение прогресса в localStorage
    saveProgress() {
        try {
            localStorage.setItem('automationTasksProgress', JSON.stringify({
                currentTask: this.currentTask,
                timestamp: Date.now()
            }));
        } catch (e) {
            console.warn('Не удалось сохранить прогресс:', e);
        }
    },
    
    // Загрузка прогресса из localStorage
    loadProgress() {
        try {
            const saved = localStorage.getItem('automationTasksProgress');
            if (saved) {
                const progress = JSON.parse(saved);
                // Восстанавливаем прогресс только если он не старше 7 дней
                if (Date.now() - progress.timestamp < 7 * 24 * 60 * 60 * 1000) {
                    this.showTask(progress.currentTask);
                    return;
                }
            }
        } catch (e) {
            console.warn('Не удалось загрузить прогресс:', e);
        }
        
        // По умолчанию показываем первое задание
        this.showTask(1);
    },
    
    // Скрыть все подсказки
    hideAllHints() {
        const allHints = document.querySelectorAll('.hints.show');
        allHints.forEach(hints => {
            hints.classList.remove('show');
            const button = hints.previousElementSibling;
            button.textContent = '💡 Показать подсказки';
        });
    },
    
    // Прокрутка наверх
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
};

// Дополнительные утилиты
const Utils = {
    // Копирование кода в буфер обмена
    copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.showNotification('Код скопирован в буфер обмена!');
            }).catch(err => {
                console.error('Ошибка копирования:', err);
                this.fallbackCopyToClipboard(text);
            });
        } else {
            this.fallbackCopyToClipboard(text);
        }
    },
    
    // Резервный способ копирования
    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showNotification('Код скопирован в буфер обмена!');
        } catch (err) {
            console.error('Ошибка копирования:', err);
            this.showNotification('Не удалось скопировать код');
        }
        
        document.body.removeChild(textArea);
    },
    
    // Показ уведомлений
    showNotification(message, type = 'success') {
        // Создаем элемент уведомления
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Стили для уведомления
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'success' ? '#4CAF50' : '#f44336',
            color: 'white',
            padding: '15px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: '10000',
            fontSize: '14px',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'all 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        // Анимация появления
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Удаление уведомления
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
};

// Добавляем кнопки копирования к примерам кода
function addCopyButtons() {
    const codeBlocks = document.querySelectorAll('.code-example pre code');
    
    codeBlocks.forEach((codeBlock, index) => {
        const container = codeBlock.closest('.code-example');
        
        // Создаем кнопку копирования
        const copyButton = document.createElement('button');
        copyButton.innerHTML = '📋 Копировать';
        copyButton.className = 'copy-button';
        
        // Стили для кнопки
        Object.assign(copyButton.style, {
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(255,255,255,0.1)',
            color: '#d4d4d4',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '5px',
            padding: '5px 10px',
            cursor: 'pointer',
            fontSize: '12px',
            transition: 'all 0.3s ease'
        });
        
        // Обработчик клика
        copyButton.addEventListener('click', () => {
            Utils.copyToClipboard(codeBlock.textContent);
            copyButton.innerHTML = '✅ Скопировано';
            setTimeout(() => {
                copyButton.innerHTML = '📋 Копировать';
            }, 2000);
        });
        
        // Добавляем кнопку к контейнеру
        container.style.position = 'relative';
        container.appendChild(copyButton);
    });
}

// Плавная прокрутка для якорных ссылок
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Отслеживание прогресса чтения
function setupReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.id = 'reading-progress';
    
    Object.assign(progressBar.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '0%',
        height: '3px',
        background: 'linear-gradient(to right, #667eea, #764ba2)',
        zIndex: '9999',
        transition: 'width 0.3s ease'
    });
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        progressBar.style.width = scrolled + '%';
    });
}

// Обработчик события загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    // Инициализация основного приложения
    AutomationTasksApp.init();
    
    // Дополнительные функции
    addCopyButtons();
    setupSmoothScroll();
    setupReadingProgress();
    
    // Показываем приветственное сообщение
    setTimeout(() => {
        Utils.showNotification('Добро пожаловать! Используйте стрелки ← → для навигации между заданиями');
    }, 1000);
});

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    // Перерасчет позиций элементов при необходимости
    const activeTask = document.querySelector('.task-card.active');
    if (activeTask) {
        // Дополнительная логика для адаптивности
    }
});

// Экспорт для использования в других скриптах
window.AutomationTasksApp = AutomationTasksApp;
window.Utils = Utils;