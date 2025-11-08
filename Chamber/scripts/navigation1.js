// directory1.js
async function loadMembers() {
  const container = document.getElementById('members-container');
  const searchEl = document.getElementById('member-search');
  const gridBtn = document.getElementById('grid-view');
  const listBtn = document.getElementById('list-view');

  if (!container || !searchEl || !gridBtn || !listBtn) return;

  try {
    const response = await fetch('data/members.json'); // adjust path if needed
    if (!response.ok) throw new Error('Failed to fetch members data');
    const data = await response.json();
    let members = data.members || [];

    function displayMembers(list) {
      if (!list || list.length === 0) {
        container.innerHTML = '<p class="error">No members found.</p>';
        return;
      }

      container.innerHTML = list.map(member => `
        <article class="member-card" tabindex="0" role="group" aria-labelledby="member-${member.id}-name">
          <img src="images/${member.image}" alt="${member.name}" width="100%" height="140" loading="lazy">
          <div class="member-info">
            <h3 id="member-${member.id}-name">${member.name}</h3>
            <p>${member.address}</p>
            <p>${member.phone}</p>
            <p><a href="${member.website}" target="_blank" rel="noopener">Visit Website</a></p>
            <span class="membership-level">${getMembershipBadge(member.membershipLevel)}</span>
          </div>
        </article>
      `).join('');
    }

    function getMembershipBadge(level) {
      const badges = { 1: '🔵 Member', 2: '⚪ Silver', 3: '🟡 Gold' };
      return badges[level] || 'Member';
    }

    // Filter members by search
    searchEl.addEventListener('input', () => {
      const query = searchEl.value.toLowerCase();
      const filtered = members.filter(m =>
        m.name.toLowerCase().includes(query) ||
        m.address.toLowerCase().includes(query) ||
        m.phone.toLowerCase().includes(query)
      );
      displayMembers(filtered);
    });

    // Grid/List Toggle
    gridBtn.addEventListener('click', () => {
      container.className = 'member-grid grid-display';
      gridBtn.classList.add('active');
      listBtn.classList.remove('active');
    });

    listBtn.addEventListener('click', () => {
      container.className = 'member-grid list-display';
      listBtn.classList.add('active');
      gridBtn.classList.remove('active');
    });

    // Initial display
    displayMembers(members);

  } catch (error) {
    console.error('Error loading members:', error);
    container.innerHTML = '<p class="error">Failed to load members. Please try again later.</p>';
  }
}

document.addEventListener('DOMContentLoaded', loadMembers);

