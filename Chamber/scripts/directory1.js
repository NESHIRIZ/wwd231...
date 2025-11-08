// directory.js
async function loadMembers() {
  const container = document.querySelector('#members-container');
  try {
    const response = await fetch('../data/members.json');
    if (!response.ok) throw new Error('Failed to fetch members data');
    const data = await response.json();
    displayMembers(data.members);
  } catch (error) {
    console.error('Error loading members:', error);
    container.innerHTML =
      '<p class="error">Failed to load members. Please try again later.</p>';
  }
}

function displayMembers(members) {
  const container = document.querySelector('#members-container');
  if (!members || members.length === 0) {
    container.innerHTML = '<p class="error">No members found.</p>';
    return;
  }

  container.innerHTML = members
    .map(
      member => `
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
  `
    )
    .join('');
}

function getMembershipBadge(level) {
  const badges = {
    1: '🔵 Member',
    2: '⚪ Silver',
    3: '🟡 Gold',
  };
  return badges[level] || 'Member';
}

// Grid/List Toggle
const container = document.querySelector('#members-container');
document.querySelector('#grid-view').addEventListener('click', function () {
  container.className = 'member-grid grid-display';
  this.classList.add('active');
  document.querySelector('#list-view').classList.remove('active');
});

document.querySelector('#list-view').addEventListener('click', function () {
  container.className = 'member-grid list-display';
  this.classList.add('active');
  document.querySelector('#grid-view').classList.remove('active');
});

// Initialize
document.addEventListener('DOMContentLoaded', loadMembers);

