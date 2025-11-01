// Directory enhancements: client-side search, sort and simple accessibility improvements

(function () {
  const list = document.querySelector('.business-list');
  if (!list) return;

  // Build items array from existing DOM
  const items = Array.from(list.querySelectorAll('li')).map((li, idx) => {
    const nameEl = li.querySelector('h2');
    const descEl = li.querySelector('p');
    return {
      id: idx,
      name: nameEl ? nameEl.textContent.trim() : '',
      desc: descEl ? descEl.textContent.trim() : '',
      node: li
    };
  });

  // Controls: search, sort, clear (create if not present)
  let controls = list.parentNode.querySelector('.directory-controls');
  if (!controls) {
    controls = document.createElement('div');
    controls.className = 'directory-controls';
    controls.innerHTML = `
      <label class="sr-only" for="biz-search">Search businesses</label>
      <input id="biz-search" type="search" placeholder="Search businesses, e.g. 'tech' or 'market'">
      <select id="biz-sort" aria-label="Sort businesses">
        <option value="relevance">Sort: Relevance</option>
        <option value="az">A → Z</option>
        <option value="za">Z → A</option>
      </select>
      <button id="biz-clear" type="button" aria-label="Clear search">Clear</button>
    `;
    list.parentNode.insertBefore(controls, list);
  }

  const searchInput = controls.querySelector('#biz-search');
  const sortSelect = controls.querySelector('#biz-sort');
  const clearBtn = controls.querySelector('#biz-clear');

  function debounce(fn, wait = 160) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  function renderMatches(filtered) {
    items.forEach(i => i.node.style.display = 'none');
    filtered.forEach(i => i.node.style.display = '');
    if (filtered.length === 0) {
      if (!list._noResults) {
        const no = document.createElement('li');
        no.className = 'no-results';
        no.textContent = 'No businesses matched your search.';
        no.tabIndex = 0;
        list.appendChild(no);
        list._noResults = no;
      }
    } else {
      if (list._noResults) {
        list._noResults.remove();
        delete list._noResults;
      }
    }
  }

  function searchAndSort() {
    const q = (searchInput.value || '').trim().toLowerCase();
    let filtered = items.filter(i => {
      if (!q) return true;
      return (i.name + ' ' + i.desc).toLowerCase().includes(q);
    });

    const sort = sortSelect.value;
    if (sort === 'az') filtered.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'za') filtered.sort((a, b) => b.name.localeCompare(a.name));

    renderMatches(filtered);
  }

  const debounced = debounce(searchAndSort, 160);
  searchInput.addEventListener('input', debounced);
  sortSelect.addEventListener('change', searchAndSort);
  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    sortSelect.value = 'relevance';
    searchAndSort();
    searchInput.focus();
  });

  // initial render
  searchAndSort();
})();