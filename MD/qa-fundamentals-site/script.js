// Источник данных: ../anki-week1-2-qa-fundamentals.txt (Anki, таб-разделитель, HTML включен)
// Внимание: Для загрузки файла используйте HTTP-сервер (fetch не работает из file:// в большинстве браузеров)

const state = {
  cards: [],
  filtered: [],
  index: 0,
  known: new Set(JSON.parse(localStorage.getItem('qa_known') || '[]')),
  bestPercent: Number(localStorage.getItem('qa_best') || 0),
  sections: [],
};

function saveProgress() {
  localStorage.setItem('qa_known', JSON.stringify(Array.from(state.known)));
}
function saveBest(percent) {
  const best = Math.max(state.bestPercent, percent);
  state.bestPercent = best;
  localStorage.setItem('qa_best', String(best));
}

async function loadData() {
  const url = '../anki-week1-2-qa-fundamentals.txt';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Не удалось загрузить колоду: ' + res.status);
  const text = await res.text();
  parseAnkiText(text);
}

function parseAnkiText(text) {
  const lines = text.split(/\r?\n/);
  let currentSection = 'Общие';
  const cards = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith('#separator') || line.startsWith('#html:') || line.startsWith('#tags:')) continue;
    const secMatch = line.match(/^#\s*=====\s*(.+?)\s*=====\s*$/);
    if (secMatch) { currentSection = secMatch[1]; continue; }
    const tabIdx = line.indexOf('\t');
    if (tabIdx > -1) {
      const term = line.slice(0, tabIdx).trim();
      const html = line.slice(tabIdx + 1).trim();
      cards.push({ term, html, section: currentSection });
    }
  }
  state.cards = cards;
  state.sections = Array.from(new Set(cards.map(c => c.section)));
  applyFilters();
  buildUI();
}

function applyFilters() {
  const sectionVal = document.getElementById('sectionFilter')?.value || 'all';
  const q = (document.getElementById('searchInput')?.value || '').toLowerCase();
  const hideKnown = document.getElementById('hideKnown')?.checked || false;
  let arr = state.cards;
  if (sectionVal !== 'all') arr = arr.filter(c => c.section === sectionVal);
  if (q) arr = arr.filter(c => c.term.toLowerCase().includes(q) || c.html.toLowerCase().includes(q));
  if (hideKnown) arr = arr.filter(c => !state.known.has(c.term));
  state.filtered = arr;
  state.index = 0;
  updateStats();
}

function updateStats() {
  document.getElementById('stat-total').textContent = String(state.cards.length);
  document.getElementById('stat-known').textContent = String(state.known.size);
  document.getElementById('stat-best').textContent = `${state.bestPercent}%`;
}

function buildUI() {
  const sectionFilter = document.getElementById('sectionFilter');
  // Заполнить разделы
  for (const s of state.sections) {
    const opt = document.createElement('option');
    opt.value = s; opt.textContent = s; sectionFilter.appendChild(opt);
  }
  // Обработчики
  sectionFilter.addEventListener('change', () => { applyFilters(); renderCard(); renderGlossary(); });
  document.getElementById('searchInput').addEventListener('input', () => { applyFilters(); renderCard(); renderGlossary(); });
  document.getElementById('hideKnown').addEventListener('change', () => { applyFilters(); renderCard(); renderGlossary(); });
  document.getElementById('shuffleBtn').addEventListener('click', () => { shuffle(state.cards); applyFilters(); renderCard(); renderGlossary(); });
  document.getElementById('resetProgressBtn').addEventListener('click', () => { if (confirm('Сбросить прогресс изучения?')) { state.known.clear(); saveProgress(); updateStats(); applyFilters(); renderCard(); renderGlossary(); } });

  // Карточки
  const cardEl = document.getElementById('card');
  cardEl.addEventListener('click', () => cardEl.classList.toggle('flipped'));
  document.getElementById('flipBtn').addEventListener('click', () => cardEl.classList.toggle('flipped'));
  document.getElementById('prevBtn').addEventListener('click', prevCard);
  document.getElementById('nextBtn').addEventListener('click', nextCard);
  document.getElementById('markKnownBtn').addEventListener('click', markKnown);

  // Викторина
  document.getElementById('startQuizBtn').addEventListener('click', startQuiz);
  document.getElementById('nextQuestionBtn').addEventListener('click', nextQuestion);

  // Настройки
  document.getElementById('largeText').addEventListener('change', (e) => {
    document.body.classList.toggle('large-text', e.target.checked);
  });
  document.getElementById('highContrast').addEventListener('change', (e) => {
    document.body.classList.toggle('high-contrast', e.target.checked);
  });

  renderCard();
  renderGlossary();
}

function renderCard() {
  const cardEl = document.getElementById('card');
  cardEl.classList.remove('flipped');
  if (state.filtered.length === 0) {
    document.getElementById('cardSection').textContent = '—';
    document.getElementById('cardTerm').textContent = 'Нет карточек по текущим фильтрам';
    document.getElementById('cardContent').innerHTML = 'Измените раздел/поиск или сбросьте фильтр «Скрывать изученные».';
    return;
  }
  const c = state.filtered[state.index];
  document.getElementById('cardSection').textContent = c.section;
  document.getElementById('cardTerm').textContent = c.term;
  document.getElementById('cardContent').innerHTML = c.html;
}
function prevCard() { if (state.filtered.length) { state.index = (state.index - 1 + state.filtered.length) % state.filtered.length; renderCard(); } }
function nextCard() { if (state.filtered.length) { state.index = (state.index + 1) % state.filtered.length; renderCard(); } }
function markKnown() {
  if (!state.filtered.length) return;
  const c = state.filtered[state.index];
  state.known.add(c.term); saveProgress(); updateStats(); applyFilters(); renderCard(); renderGlossary();
}

function renderGlossary() {
  const list = document.getElementById('glossaryList');
  list.innerHTML = '';
  for (const c of state.filtered.slice(0, 300)) { // ограничим вывод
    const li = document.createElement('li');
    li.className = 'glossary-item';
    li.innerHTML = `<div class="term">${escapeHtml(c.term)}</div><div class="section">${escapeHtml(c.section)}</div>`;
    list.appendChild(li);
  }
}

// Викторина
let quiz = null;
function startQuiz() {
  const count = Number(document.getElementById('quizCount').value);
  const pool = state.filtered.length ? state.filtered : state.cards;
  if (pool.length < 4) { alert('Недостаточно карточек для викторины'); return; }
  quiz = {
    questions: buildQuestions(pool, count),
    i: 0,
    score: 0,
    answered: false,
  };
  document.getElementById('quizArea').classList.remove('hidden');
  document.getElementById('quizResult').classList.add('hidden');
  showQuestion();
}
function buildQuestions(pool, count) {
  const qs = [];
  const indices = [...Array(pool.length).keys()]; shuffle(indices);
  for (let k = 0; k < Math.min(count, pool.length); k++) {
    const c = pool[indices[k]];
    // Вопрос: показать определение (укороченное), выбрать термин
    const correct = c.term;
    const options = new Set([correct]);
    while (options.size < 4) {
      const r = pool[Math.floor(Math.random() * pool.length)].term;
      options.add(r);
    }
    const opts = Array.from(options); shuffle(opts);
    qs.push({ prompt: shorten(stripHtml(c.html), 220), correct, options: opts });
  }
  return qs;
}
function showQuestion() {
  const q = quiz.questions[quiz.i];
  document.getElementById('quizStatus').textContent = `Вопрос ${quiz.i + 1} / ${quiz.questions.length}`;
  document.getElementById('quizQuestion').textContent = q.prompt;
  const box = document.getElementById('quizOptions');
  box.innerHTML = '';
  for (const opt of q.options) {
    const b = document.createElement('button');
    b.className = 'quiz-option'; b.textContent = opt;
    b.addEventListener('click', () => chooseOption(b, opt));
    box.appendChild(b);
  }
  document.getElementById('nextQuestionBtn').disabled = true;
}
function chooseOption(btn, value) {
  if (quiz.answered) return;
  quiz.answered = true;
  const q = quiz.questions[quiz.i];
  const buttons = Array.from(document.getElementById('quizOptions').children);
  for (const b of buttons) {
    if (b.textContent === q.correct) b.classList.add('correct');
    else b.classList.add('incorrect');
    b.disabled = true;
  }
  if (value === q.correct) quiz.score++;
  document.getElementById('nextQuestionBtn').disabled = false;
}
function nextQuestion() {
  quiz.i++;
  quiz.answered = false;
  if (quiz.i >= quiz.questions.length) {
    const percent = Math.round((quiz.score / quiz.questions.length) * 100);
    saveBest(percent);
    document.getElementById('quizArea').classList.add('hidden');
    const res = document.getElementById('quizResult');
    res.classList.remove('hidden');
    res.textContent = `Результат: ${quiz.score} из ${quiz.questions.length} (${percent}%)`;
    updateStats();
    return;
  }
  showQuestion();
}

// Утилиты
function shuffle(arr) { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } }
function stripHtml(html) { const tmp = document.createElement('div'); tmp.innerHTML = html; return tmp.textContent || tmp.innerText || ''; }
function shorten(s, n) { return s.length > n ? s.slice(0, n - 1) + '…' : s; }
function escapeHtml(s) { return s.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }

// Инициализация
window.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadData();
  } catch (e) {
    console.error(e);
    // Показать ошибку в карточке
    document.getElementById('cardTerm').textContent = 'Ошибка загрузки данных';
    document.getElementById('cardContent').textContent = 'Для работы сайта запустите локальный HTTP‑сервер в папке MD.';
  }
});
