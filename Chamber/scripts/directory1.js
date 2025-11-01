// directory.js

let membersData = []; // Store members globally

// Load member data
async function loadMembers() {
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) throw new Error('Failed to fetch members data');
        const data = await response.json();
        membersData = data.members; // Save data
        displayMembers(membersData);
    } catch (error) {
        console.error('Error loading members:', error);
        document.querySelector('#members-container').innerHTML =
            '<p class="error">Failed to load members. Please try again later.</p>';
    }
}

// Display member cards
function displayMembers(members) {
    const container = document.querySelector('#members-container');
    if (!container) return;

    if (!members || members.length === 0) {
        container.innerHTML = '<p class="error">No members found.</p>';
        return;
    }

    container.innerHTML = members.map((member, index) => `
        <article class="member-card" tabindex="0" role="group" aria-labelledby="member-${index}-name">
            <img src="images/${member.image}" alt="${member.name}" class="member-img" loading="lazy">
            <div class="member-info">
                <h3 id="member-${index}-name">${member.name}</h3>
                <p>${member.address}</p>
                <p>${member.phone}</p>
                <p><a href="${member.website}" target="_blank" rel="noopener">Visit Website</a></p>
                <span class="membership-level">${getMembershipBadge(member.membershipLevel)}</span>
            </div>
        </article>
    `).join('');
}

// Get membership badge text
function getMembershipBadge(level) {
    const badges = {
        1: '🔵 Member',
        2: '⚪ Silver',
        3: '🟡 Gold'
    };
    return badges[level] || 'Member';
}

// Wait until DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('#members-container');
    const gridBtn = document.querySelector('#grid-view');
    const listBtn = document.querySelector('#list-view');
    const searchInput = document.querySelector('#member-search');

    // Grid View
    gridBtn.addEventListener('click', () => {
        container.className = 'member-grid grid-display';
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
    });

    // List View
    listBtn.addEventListener('click', () => {
        container.className = 'member-grid list-display';
        listBtn.classList.add('active');
        gridBtn.classList.remove('active');
    });

    // Live Search
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = membersData.filter(member =>
            member.name.toLowerCase().includes(query) ||
            member.address.toLowerCase().includes(query)
        );
        displayMembers(filtered);
    });

    // Load Members on page load
    loadMembers();
});
