// Get DOM elements
const linkForm = document.getElementById('linkForm');
const websiteName = document.getElementById('websiteName');
const websiteURL = document.getElementById('websiteURL');
const websiteDescription = document.getElementById('websiteDescription');
const linksList = document.getElementById('linksList');
const searchInput = document.getElementById('searchInput');
const messageBox = document.getElementById('messageBox');

// Load saved links from localStorage
let savedLinks = JSON.parse(localStorage.getItem('links')) || [];

// Save links to localStorage
function saveToLocalStorage() {
    localStorage.setItem('links', JSON.stringify(savedLinks));
}

// Show temporary success/info message
function showMessage(text, color = 'teal') {
    messageBox.textContent = text;
    messageBox.style.color = color;
    setTimeout(() => {
        messageBox.textContent = '';
    }, 3000);
}

// Render links
function renderLinks(filteredLinks = savedLinks) {
    linksList.innerHTML = '';
    filteredLinks.forEach((link, index) => {
        const card = document.createElement('div');
        card.className = 'link-card';

        const title = document.createElement('h3');
        title.textContent = link.name;
        card.appendChild(title);

        const description = document.createElement('p');
        description.textContent = link.description;
        card.appendChild(description);

        const actions = document.createElement('div');
        actions.className = 'link-actions';

        const visitLink = document.createElement('a');
        visitLink.href = link.url;
        visitLink.target = '_blank';
        visitLink.textContent = 'Visit';
        actions.appendChild(visitLink);

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit-btn';
        editButton.onclick = () => editLink(index);
        actions.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-btn';
        deleteButton.onclick = () => deleteLink(index);
        actions.appendChild(deleteButton);

        card.appendChild(actions);
        linksList.appendChild(card);
    });

    if (filteredLinks.length === 0) {
        linksList.innerHTML = "<p style='text-align:center;'>No matching links found.</p>";
    }
}

// Handle form submit
linkForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newLink = {
        name: websiteName.value,
        url: websiteURL.value,
        description: websiteDescription.value
    };
    savedLinks.push(newLink);
    saveToLocalStorage();
    renderLinks();
    linkForm.reset();
    showMessage('✅ Link saved successfully!');
});

// Edit link
function editLink(index) {
    const link = savedLinks[index];
    websiteName.value = link.name;
    websiteURL.value = link.url;
    websiteDescription.value = link.description;
    savedLinks.splice(index, 1);
    saveToLocalStorage();
    renderLinks();
    showMessage('📝 Link ready to be edited. Update and save!');
}

// Delete link
function deleteLink(index) {
    const confirmDelete = confirm("Are you sure you want to delete this link?");
    if (confirmDelete) {
        savedLinks.splice(index, 1);
        saveToLocalStorage();
        renderLinks();
        showMessage('❌ Link deleted successfully!', 'crimson');
    }
}

// Search function
searchInput.addEventListener('input', () => {
    const keyword = searchInput.value.toLowerCase();
    const filteredLinks = savedLinks.filter(link => 
        link.name.toLowerCase().includes(keyword) ||
        link.description.toLowerCase().includes(keyword)
    );
    renderLinks(filteredLinks);
});

// Initial render
renderLinks();