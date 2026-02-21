// Загрузка данных
let appData = {
    words: [],
    texts: []
};

let currentProfile = null;
let defaultData = null;

// Инициализация приложения
async function init() {
    try {
        // Загружаем данные по умолчанию из JSON
        const response = await fetch('data.json');
        defaultData = await response.json();
        
        // Инициализируем профили
        initProfiles();
        setupEventListeners();
        
        // Проверяем, есть ли сохраненный профиль
        const savedProfile = localStorage.getItem('currentProfile');
        if (savedProfile && getProfiles()[savedProfile]) {
            loadProfile(savedProfile);
        } else {
            showProfileScreen();
        }
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        showEmptyState();
    }
}

// Настройка обработчиков событий
function setupEventListeners() {
    // Переключение табов
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tab = e.target.dataset.tab;
            switchTab(tab);
        });
    });

    // Закрытие модального окна перевода
    document.getElementById('close-modal').addEventListener('click', closeModal);
    document.getElementById('translation-modal').addEventListener('click', (e) => {
        if (e.target.id === 'translation-modal') {
            closeModal();
        }
    });

    // Кнопка профиля (проверяем существование)
    const profileBtn = document.getElementById('profile-btn');
    if (profileBtn) {
        profileBtn.addEventListener('click', showManageProfilesModal);
    }

    // Обработчики для модальных окон профилей будут добавлены при их открытии
}

// Переключение между секциями
function switchTab(tab) {
    // Обновление кнопок навигации
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    // Обновление секций
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`${tab}-section`).classList.add('active');
}

// Отображение слов
function renderWords() {
    const container = document.getElementById('words-container');
    
    if (appData.words.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>Нет слов</h3><p>Добавьте слова в data.json</p></div>';
        return;
    }

    container.innerHTML = appData.words.map(word => `
        <div class="word-card">
            <h3>${word.word}</h3>
            <div class="translation">${word.translation}</div>
            <div class="example">${word.example}</div>
        </div>
    `).join('');
}

// Отображение текстов
function renderTexts() {
    const container = document.getElementById('texts-container');
    
    if (appData.texts.length === 0) {
        container.innerHTML = '<div class="empty-state"><h3>Нет текстов</h3><p>Добавьте тексты в data.json</p></div>';
        return;
    }

    container.innerHTML = appData.texts.map((text, index) => `
        <div class="text-card">
            <h3>${text.title}</h3>
            <div class="text-content" data-text-id="${index}">
                ${processText(text.content)}
            </div>
        </div>
    `).join('');

    // Добавление обработчиков для слов в тексте
    document.querySelectorAll('.text-content .word').forEach(wordEl => {
        wordEl.addEventListener('click', (e) => {
            const word = e.target.dataset.word;
            showTranslation(word);
        });
    });
}

// Обработка текста для выделения слов
function processText(text) {
    const words = appData.words;
    let processedText = text;

    // Сортируем слова по длине (от длинных к коротким) для корректной замены
    const sortedWords = [...words].sort((a, b) => b.word.length - a.word.length);

    sortedWords.forEach(wordObj => {
        const word = wordObj.word;
        // Используем регулярное выражение для замены слова с сохранением регистра
        const regex = new RegExp(`\\b(${word})\\b`, 'gi');
        processedText = processedText.replace(regex, (match) => {
            return `<span class="word" data-word="${word.toLowerCase()}">${match}</span>`;
        });
    });

    return processedText;
}

// Показать перевод слова
function showTranslation(word) {
    const wordData = appData.words.find(w => w.word.toLowerCase() === word.toLowerCase());
    
    if (!wordData) return;

    document.getElementById('modal-word').textContent = wordData.word;
    document.getElementById('modal-translation').textContent = wordData.translation;
    document.getElementById('modal-example').textContent = wordData.example;
    document.getElementById('translation-modal').classList.add('active');
}

// Закрыть модальное окно
function closeModal() {
    document.getElementById('translation-modal').classList.remove('active');
}

// Показать пустое состояние
function showEmptyState() {
    document.getElementById('words-container').innerHTML = 
        '<div class="empty-state"><h3>Ошибка загрузки</h3><p>Не удалось загрузить данные</p></div>';
}

// ========== УПРАВЛЕНИЕ ПРОФИЛЯМИ ==========

// Инициализация профилей
function initProfiles() {
    const profiles = getProfiles();
    if (Object.keys(profiles).length === 0 && defaultData) {
        // Создаем профиль по умолчанию
        const defaultProfileName = 'Мой профиль';
        profiles[defaultProfileName] = {
            words: defaultData.words,
            texts: defaultData.texts,
            createdAt: Date.now()
        };
        saveProfiles(profiles);
    }
}

// Получить все профили
function getProfiles() {
    const profiles = localStorage.getItem('profiles');
    return profiles ? JSON.parse(profiles) : {};
}

// Сохранить профили
function saveProfiles(profiles) {
    localStorage.setItem('profiles', JSON.stringify(profiles));
}

// Загрузить профиль
function loadProfile(profileName) {
    const profiles = getProfiles();
    if (profiles[profileName]) {
        currentProfile = profileName;
        appData = profiles[profileName];
        localStorage.setItem('currentProfile', profileName);
        
        // Обновляем UI
        document.getElementById('current-profile-name').textContent = profileName;
        renderWords();
        renderTexts();
        hideProfileScreen();
    }
}

// Показать экран выбора профиля
function showProfileScreen() {
    const profiles = getProfiles();
    const profilesList = document.getElementById('profiles-list');
    
    profilesList.innerHTML = Object.keys(profiles).map(name => {
        const escapedName = name.replace(/'/g, "\\'");
        return `
            <div class="profile-item ${name === currentProfile ? 'current' : ''}" data-profile="${name}">
                <span class="profile-item-name">${name}</span>
                ${Object.keys(profiles).length > 1 ? `<button class="profile-item-delete" data-profile="${name}" onclick="event.stopPropagation(); deleteProfile('${escapedName}')">Удалить</button>` : ''}
            </div>
        `;
    }).join('');

    // Добавляем обработчики для выбора профиля
    document.querySelectorAll('#profiles-list .profile-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const profileName = e.currentTarget.dataset.profile;
            loadProfile(profileName);
        });
    });

    document.getElementById('profile-screen').classList.add('active');
    
    // Добавляем обработчик для кнопки создания профиля ПОСЛЕ показа экрана
    setTimeout(() => {
        const createBtn = document.getElementById('create-profile-btn');
        if (createBtn) {
            console.log('Кнопка создания профиля найдена, добавляем обработчик');
            createBtn.onclick = (e) => {
                console.log('Кнопка создания профиля нажата');
                e.preventDefault();
                e.stopPropagation();
                showCreateProfileModal();
            };
        } else {
            console.error('Кнопка create-profile-btn не найдена в DOM');
        }
    }, 0);
}

// Скрыть экран выбора профиля
function hideProfileScreen() {
    document.getElementById('profile-screen').classList.remove('active');
}

// Показать модальное окно создания профиля
function showCreateProfileModal() {
    const modal = document.getElementById('create-profile-modal');
    const input = document.getElementById('new-profile-name');
    const saveBtn = document.getElementById('save-profile-btn');
    const cancelBtn = document.getElementById('cancel-profile-btn');
    
    input.value = '';
    
    // Добавляем обработчики
    saveBtn.onclick = saveNewProfile;
    cancelBtn.onclick = closeCreateProfileModal;
    
    // Enter для создания профиля
    input.onkeypress = (e) => {
        if (e.key === 'Enter') {
            saveNewProfile();
        }
    };
    
    // Закрытие по клику на фон
    modal.onclick = (e) => {
        if (e.target.id === 'create-profile-modal') {
            closeCreateProfileModal();
        }
    };
    
    modal.classList.add('active');
    setTimeout(() => {
        input.focus();
    }, 100);
}

// Закрыть модальное окно создания профиля
function closeCreateProfileModal() {
    document.getElementById('create-profile-modal').classList.remove('active');
}

// Сохранить новый профиль
function saveNewProfile() {
    const name = document.getElementById('new-profile-name').value.trim();
    
    if (!name) {
        alert('Введите название профиля');
        return;
    }

    const profiles = getProfiles();
    
    if (profiles[name]) {
        alert('Профиль с таким названием уже существует');
        return;
    }

    // Создаем новый профиль с данными по умолчанию
    profiles[name] = {
        words: defaultData ? [...defaultData.words] : [],
        texts: defaultData ? [...defaultData.texts] : [],
        createdAt: Date.now()
    };

    saveProfiles(profiles);
    closeCreateProfileModal();
    loadProfile(name);
    renderManageProfilesList();
}

// Показать модальное окно управления профилями
function showManageProfilesModal() {
    const modal = document.getElementById('manage-profiles-modal');
    const addBtn = document.getElementById('add-new-profile-btn');
    const closeBtn = document.getElementById('close-manage-profiles-btn');
    
    renderManageProfilesList();
    
    // Добавляем обработчики
    if (addBtn) {
        addBtn.onclick = () => {
            closeManageProfilesModal();
            showCreateProfileModal();
        };
    }
    
    if (closeBtn) {
        closeBtn.onclick = closeManageProfilesModal;
    }
    
    // Закрытие по клику на фон
    modal.onclick = (e) => {
        if (e.target.id === 'manage-profiles-modal') {
            closeManageProfilesModal();
        }
    };
    
    modal.classList.add('active');
}

// Закрыть модальное окно управления профилями
function closeManageProfilesModal() {
    document.getElementById('manage-profiles-modal').classList.remove('active');
}

// Отрисовать список профилей в окне управления
function renderManageProfilesList() {
    const profiles = getProfiles();
    const container = document.getElementById('manage-profiles-list');
    
    container.innerHTML = Object.keys(profiles).map(name => {
        const escapedName = name.replace(/'/g, "\\'");
        return `
            <div class="profile-item ${name === currentProfile ? 'current' : ''}" data-profile="${name}">
                <span class="profile-item-name">${name}</span>
                ${Object.keys(profiles).length > 1 ? `<button class="profile-item-delete" data-profile="${name}" onclick="event.stopPropagation(); deleteProfileFromManage('${escapedName}')">Удалить</button>` : ''}
            </div>
        `;
    }).join('');

    // Добавляем обработчики для переключения профиля
    document.querySelectorAll('#manage-profiles-list .profile-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const profileName = e.currentTarget.dataset.profile;
            loadProfile(profileName);
            renderManageProfilesList();
        });
    });
}

// Удалить профиль (из экрана выбора)
window.deleteProfile = function(profileName) {
    if (!confirm(`Удалить профиль "${profileName}"?`)) {
        return;
    }

    const profiles = getProfiles();
    delete profiles[profileName];
    saveProfiles(profiles);

    if (currentProfile === profileName) {
        currentProfile = null;
        localStorage.removeItem('currentProfile');
    }

    // Если профилей не осталось, создаем новый
    if (Object.keys(profiles).length === 0) {
        initProfiles();
    }

    showProfileScreen();
}

// Удалить профиль (из окна управления)
window.deleteProfileFromManage = function(profileName) {
    if (!confirm(`Удалить профиль "${profileName}"?`)) {
        return;
    }

    const profiles = getProfiles();
    delete profiles[profileName];
    saveProfiles(profiles);

    if (currentProfile === profileName) {
        // Переключаемся на первый доступный профиль
        const remainingProfiles = Object.keys(profiles);
        if (remainingProfiles.length > 0) {
            loadProfile(remainingProfiles[0]);
        } else {
            initProfiles();
            loadProfile(Object.keys(getProfiles())[0]);
        }
    }

    renderManageProfilesList();
}

// Запуск приложения
init();
