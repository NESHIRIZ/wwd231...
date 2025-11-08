// directory.js
// Handles loading, displaying, and toggling member views (grid/list).

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('#members-container');
  const gridBtn = document.querySelector('#grid-view');
  const listBtn = document.querySelector('#list-view');

  if (!container) {
    console.error('❌ Members container not found.');
    return;
  }

  // Load member data
  async function loadMembers() {
    try {
      const response = await fetch('data/members.json'); // Adjust path if needed
      if (!response.ok) throw new Error('Failed to fetch members data');
      const data = await response.json();

      if (!data.members || data.members.length === 0) {
        container.innerHTML = `<p class="error">No members found.</p>`;
        return;
      }

      displayMembers(data.members);
    } catch (error) {
      console.error('Error loading members:', error);
      container.innerHTML =
        `<p class="error">Failed to load members. Please try again later.</p>`;
    }
  }

  // Render all members
  function displayMembers(members) {
    container.innerHTML = members
      .map(member => createMemberCard(member))
      .join('');
  }

  // Create a single member card
  function createMemberCard(member) {
    const imagePath = `images/${member.image || 'placeholder.png'}`;
    const membershipBadge = getMembershipBadge(member.membershipLevel);

    return `
      <article class="member-card" tabindex="0" role="group" aria-labelledby="member-${member.id}-name">
        <img src="${imagePath}" alt="${member.name}" loading="lazy" width="100%" height="140">
        <div class="member-info">
          <h3 id="member-${member.id}-name">${member.name}</h3>
          <p>${member.address || 'Address not available'}</p>
          <p>${member.phone || 'Phone not listed'}</p>
          <p>
            <a href="${member.website}" target="_blank" rel="noopener noreferrer">
              Visit Website
            </a>
          </p>
          <span class="membership-level">${membershipBadge}</span>
        </div>
      </article>
    `;
  }

  // Membership badge helper
  function getMembershipBadge(level) {
    const badges = {
      1: '🔵 Member',
      2: '⚪ Silver Member',
      3: '🟡 Gold Member'
    };
    return badges[level] || '🔹 Member';
  }

  // --- View Mode Toggle ---
  if (gridBtn && listBtn) {
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
  }

  // Initialize
  loadMembers();
});

