const lessonsEl = document.getElementById("lessons");
const titleEl = document.getElementById("course-title");

function getProgress() {
  return JSON.parse(localStorage.getItem("progress")) || {
    completedLessons: []
  };
}

function saveProgress(progress) {
  localStorage.setItem("progress", JSON.stringify(progress));
}

function updateStats(totalLessons) {
  const progress = getProgress();
  const percent = Math.round(
    (progress.completedLessons.length / totalLessons) * 100
  );
  document.getElementById("progress").textContent = percent + "%";
}

function renderLessons(course) {
  const progress = getProgress();

  titleEl.textContent = course.title;
  lessonsEl.innerHTML = "";

  course.lessons.forEach(lesson => {
    const li = document.createElement("li");
    li.className = "lesson";

    if (progress.completedLessons.includes(lesson.id)) {
      li.classList.add("completed");
    }

    const btn = document.createElement("button");
    btn.textContent = "Пройден";

    btn.onclick = () => {
      const progress = getProgress();
      if (!progress.completedLessons.includes(lesson.id)) {
        progress.completedLessons.push(lesson.id);
        saveProgress(progress);
        li.classList.add("completed");
        updateStats(course.lessons.length);
      }
    };

    li.textContent = lesson.title + " ";
    li.appendChild(btn);
    lessonsEl.appendChild(li);
  });
}

// 🔽 ВАЖНО: точка входа
fetch("data/course.json")
  .then(res => res.json())
  .then(course => {
    renderLessons(course);
    updateStats(course.lessons.length);
  });