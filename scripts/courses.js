(() => {
  const courses = [
    { id: 'wdd231', code: 'WDD231', title: 'Web Development I', subject: 'Web', credits: 3, completed: false, url: '#' },
    { id: 'bus101', code: 'BUS101', title: 'Introduction to Business', subject: 'Business', credits: 3, completed: false, url: '#' },
    { id: 'mkt201', code: 'MKT201', title: 'Marketing Principles', subject: 'Marketing', credits: 3, completed: false, url: '#' },
    { id: 'eng102', code: 'ENG102', title: 'Academic English', subject: 'English', credits: 2, completed: false, url: '#' }
  ];

  const listEl = document.getElementById('course-list');
  const searchEl = document.getElementById('course-search');
  const subjectFilterEl = document.getElementById('subject-filter');
  const creditsEl = document.getElementById('credits-count');
  const progressEl = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  const clearBtn = document.getElementById('clear-filters');

  if (!listEl) return;

  function populateSubjects() {
    const subjects = Array.from(new Set(courses.map(c => c.subject))).sort();
    subjects.forEach(sub => {
      const opt = document.createElement('option');
      opt.value = sub;
      opt.textContent = sub;
      subjectFilterEl.appendChild(opt);
    });
  }

  function escapeHtml(s = '') {
    return s.replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }

  function render(filter = {}) {
    const q = (filter.q || '').trim().toLowerCase();
    const subject = filter.subject || 'all';
    listEl.innerHTML = '';

    const visible = courses.filter(c => {
      const matchesQ = !q || (c.title + ' ' + c.code + ' ' + c.subject).toLowerCase().includes(q);
      const matchesSubject = subject === 'all' || c.subject === subject;
      return matchesQ && matchesSubject;
    });

    if (visible.length === 0) {
      const li = document.createElement('li');
      li.className = 'no-results';
      li.textContent = 'No courses match your search.';
      listEl.appendChild(li);
      updateCredits();
      return;
    }

    visible.forEach(course => {
      const li = document.createElement('li');
      li.className = 'course-card floating-card';
      if (course.completed) li.classList.add('completed');

      li.innerHTML = `
        <div class="course-info">
          <a href="${course.url}" target="_blank" rel="noopener noreferrer">${escapeHtml(course.title)} (${escapeHtml(course.code)})</a>
          <span>${course.subject} • ${course.credits} credits</span>
        </div>
        <div class="course-actions">
          <label>
            <input type="checkbox" class="course-select" data-id="${course.id}" ${course.completed ? 'checked' : ''} /> Select
          </label>
          <button class="toggle-completed" data-id="${course.id}">${course.completed ? 'Mark Incomplete' : 'Mark Completed'}</button>
        </div>
      `;
      listEl.appendChild(li);
    });

    attachListeners();
    updateCredits();
  }

  function attachListeners() {
    listEl.querySelectorAll('.course-select').forEach(input => {
      input.addEventListener('change', updateCredits);
    });

    listEl.querySelectorAll('.toggle-completed').forEach(btn => {
      btn.addEventListener('click', () => {
        const course = courses.find(c => c.id === btn.dataset.id);
        if (!course) return;
        course.completed = !course.completed;
        render({ q: searchEl.value, subject: subjectFilterEl.value });
      });
    });
  }

  function updateCredits() {
    const checked = Array.from(listEl.querySelectorAll('.course-select:checked')).map(i => i.dataset.id);
    const total = courses
      .filter(c => checked.includes(c.id))
      .reduce((sum, c) => sum + (Number(c.credits) || 0), 0);

    // Update credits display
    creditsEl.textContent = total;

    // Update progress bar dynamically
    const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0);
    if (progressEl && progressText) {
      const percent = Math.min((total / totalCredits) * 100, 100);
      progressEl.style.width = percent + '%';
      progressText.textContent = `${total} of ${totalCredits} credits completed (${Math.round(percent)}%)`;
    }
  }

  function debounce(fn, wait = 200) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  function initControls() {
    searchEl.addEventListener('input', debounce(() => {
      render({ q: searchEl.value, subject: subjectFilterEl.value });
    }));

    subjectFilterEl.addEventListener('change', () => {
      render({ q: searchEl.value, subject: subjectFilterEl.value });
    });

    clearBtn.addEventListener('click', () => {
      searchEl.value = '';
      subjectFilterEl.value = 'all';
      render({ q: '', subject: 'all' });
      searchEl.focus();
    });
  }

  populateSubjects();
  initControls();
  render({ q: '', subject: 'all' });
})();
