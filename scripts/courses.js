// Dynamic Course Home Page (W01 assignment) — render, filter, select and calculate credits

(() => {
  const courses = [
    {
      id: 'wdd231',
      code: 'WDD231',
      title: 'Web Development I',
      subject: 'Web',
      credits: 3,
      completed: false,
      url: 'https://byupw.instructure.com/courses/28263'
    },
    {
      id: 'bus101',
      code: 'BUS101',
      title: 'Introduction to Business',
      subject: 'Business',
      credits: 3,
      completed: false,
      url: 'https://byupw.instructure.com/courses/28969'
    },
    {
      id: 'mkt201',
      code: 'MKT201',
      title: 'Marketing Principles',
      subject: 'Marketing',
      credits: 3,
      completed: false,
      url: 'https://byupw.instructure.com/courses/29219'
    },
    {
      id: 'eng102',
      code: 'ENG102',
      title: 'Academic English',
      subject: 'English',
      credits: 2,
      completed: false,
      url: 'https://byupw.instructure.com/courses/28121'
    }
  ];

  const listEl = document.getElementById('course-list');
  const searchEl = document.getElementById('course-search');
  const subjectFilterEl = document.getElementById('subject-filter');
  const creditsEl = document.getElementById('credits-count');
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

  // Render courses as professional "floating" cards
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

      // Base floating styles applied inline so appearance is immediate without extra CSS edits
      li.style.background = '#fff';
      li.style.borderRadius = '12px';
      li.style.padding = '14px';
      li.style.boxShadow = '0 18px 40px rgba(17,24,39,0.06)';
      li.style.transition = 'transform .26s ease, box-shadow .26s ease';
      li.style.display = 'flex';
      li.style.alignItems = 'center';
      li.style.gap = '14px';
      li.style.flexWrap = 'wrap';

      li.innerHTML = `
        <div style="flex:0 0 92px; display:flex; align-items:center; justify-content:center;">
          <div aria-hidden="true" style="width:86px; height:86px; border-radius:12px; background: linear-gradient(180deg,#4DA6FF,#1E6FB8); color:#fff; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:16px; box-shadow: 0 8px 20px rgba(30,111,184,0.12);">
            ${escapeHtml(course.code)}
          </div>
        </div>

        <div style="flex:1 1 320px; min-width:200px;">
          <a class="course-link" href="${course.url}" target="_blank" rel="noopener noreferrer" style="display:inline-block; color:#1E6FB8; font-weight:700; text-decoration:none; font-size:1rem;">${escapeHtml(course.title)}</a>
          <div style="margin-top:6px; color:#6b7280; font-size:0.95rem;">
            <span style="font-weight:600; color:#374151;">${escapeHtml(course.subject)}</span>
            <span style="margin:0 8px;">•</span>
            <span>${course.credits} credits</span>
            ${course.completed ? '<span style="display:inline-block;margin-left:8px;background:rgba(30,111,184,0.08);color:#1E6FB8;padding:4px 8px;border-radius:999px;font-weight:600;font-size:0.82rem;">Completed</span>' : ''}
          </div>
        </div>

        <div style="flex:0 0 140px; display:flex; flex-direction:column; align-items:flex-end; gap:8px;">
          <label style="display:flex; align-items:center; gap:8px; font-size:0.95rem;">
            <input type="checkbox" class="course-select" data-id="${course.id}" aria-label="Select ${escapeHtml(course.title)}" />
            <span style="color:#374151;">Select</span>
          </label>
          <button class="toggle-completed" data-id="${course.id}" aria-pressed="${course.completed}" style="background:transparent;border:1px solid rgba(30,111,184,0.12); color:#1E6FB8; padding:6px 10px; border-radius:8px; cursor:pointer;">
            ${course.completed ? 'Mark Incomplete' : 'Mark Completed'}
          </button>
        </div>
      `;

      // Hover / focus effects (JS-driven to avoid needing new CSS files)
      li.addEventListener('mouseenter', () => {
        li.style.transform = 'translateY(-8px)';
        li.style.boxShadow = '0 34px 80px rgba(30,111,184,0.12)';
      });
      li.addEventListener('mouseleave', () => {
        li.style.transform = '';
        li.style.boxShadow = '0 18px 40px rgba(17,24,39,0.06)';
      });

      // keyboard focus exposure
      li.addEventListener('focusin', () => {
        li.style.transform = 'translateY(-6px)';
        li.style.boxShadow = '0 28px 64px rgba(30,111,184,0.10)';
      });
      li.addEventListener('focusout', () => {
        li.style.transform = '';
        li.style.boxShadow = '0 18px 40px rgba(17,24,39,0.06)';
      });

      listEl.appendChild(li);
    });

    attachCardListeners();
    updateCredits();
  }

  function escapeHtml(s = '') {
    return s.replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
  }

  function attachCardListeners() {
    const selects = listEl.querySelectorAll('.course-select');
    selects.forEach(input => {
      input.addEventListener('change', () => updateCredits());
    });

    const toggleBtns = listEl.querySelectorAll('.toggle-completed');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.dataset.id;
        const course = courses.find(c => c.id === id);
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
    creditsEl.textContent = total;
  }

  function initControls() {
    searchEl.addEventListener('input', debounce(() => {
      render({ q: searchEl.value, subject: subjectFilterEl.value });
    }, 180));

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

  function debounce(fn, wait = 200) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  populateSubjects();
  initControls();
  render({ q: '', subject: 'all' });
})();