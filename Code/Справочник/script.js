// DOM Elements
const searchInput = document.getElementById('searchInput');
let filterButtons;
let functionItems;
const noResults = document.getElementById('noResults');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Re-query elements to ensure they exist
    filterButtons = document.querySelectorAll('.filter-btn');
    functionItems = document.querySelectorAll('.function-item');
    
    console.log('Initialized:', {
        filterButtons: filterButtons.length,
        functionItems: functionItems.length,
        searchInput: !!searchInput,
        noResults: !!noResults
    });
    
    initializeEventListeners();
});

// Event Listeners
function initializeEventListeners() {
    // Search functionality
    searchInput.addEventListener('input', performSearch);
    
    // Search button
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    // Filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            setActiveFilter(this);
            filterFunctions(this.dataset.category);
        });
    });
    
    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Search functions
function performSearch() {
    if (!functionItems || !searchInput) return;
    
    const query = searchInput.value.toLowerCase().trim();
    
    if (query === '') {
        showAllFunctions();
        return;
    }
    
    let hasResults = false;
    
    functionItems.forEach(item => {
        const title = item.querySelector('h3').textContent.toLowerCase();
        const description = item.querySelector('.function-description').textContent.toLowerCase();
        const code = item.querySelector('.function-code').textContent.toLowerCase();
        
        if (title.includes(query) || description.includes(query) || code.includes(query)) {
            item.style.display = 'block';
            item.classList.remove('hidden');
            hasResults = true;
        } else {
            item.style.display = 'none';
            item.classList.add('hidden');
        }
    });
    
    if (noResults) {
        noResults.style.display = hasResults ? 'none' : 'block';
    }
}

// Filter functions
function setActiveFilter(activeBtn) {
    if (!filterButtons) return;
    filterButtons.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}

function filterFunctions(category) {
    if (!functionItems) return;
    
    let hasResults = false;
    
    functionItems.forEach(item => {
        const itemCategory = item.dataset.category;
        
        if (category === 'all' || itemCategory === category) {
            item.style.display = 'block';
            item.classList.remove('hidden');
            hasResults = true;
        } else {
            item.style.display = 'none';
            item.classList.add('hidden');
        }
    });
    
    // Clear search when filtering
    if (searchInput) {
        searchInput.value = '';
    }
    if (noResults) {
        noResults.style.display = hasResults ? 'none' : 'block';
    }
}

function showAllFunctions() {
    if (!functionItems) return;
    
    functionItems.forEach(item => {
        item.style.display = 'block';
        item.classList.remove('hidden');
    });
    if (noResults) {
        noResults.style.display = 'none';
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Escape to clear search
    if (e.key === 'Escape') {
        if (searchInput) {
            searchInput.value = '';
            performSearch();
            searchInput.blur();
        }
    }
});

// Utility function to highlight search terms
function highlightSearchTerm(text, term) {
    if (!term) return text;
    
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}