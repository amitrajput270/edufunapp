// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize all functionality
    initSearchFunction();
    initCatalogFilters();
    initContactForm();
    initAnimations();
    initBorrowButtons();
    initViewDetailsButtons();
});

// Search Function
function initSearchFunction() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();

    if (searchTerm === '') {
        alert('Please enter a search term');
        return;
    }

    // If on catalog page, filter books
    if (window.location.pathname.includes('catalog.html')) {
        filterBooksBySearch(searchTerm);
    } else {
        // Redirect to catalog page with search parameter
        window.location.href = `catalog.html?search=${encodeURIComponent(searchTerm)}`;
    }
}

function filterBooksBySearch(searchTerm) {
    const bookCards = document.querySelectorAll('.book-card');
    let foundBooks = 0;

    bookCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const author = card.querySelector('.author').textContent.toLowerCase();
        const genre = card.querySelector('.genre').textContent.toLowerCase();

        if (title.includes(searchTerm) || author.includes(searchTerm) || genre.includes(searchTerm)) {
            card.style.display = 'block';
            foundBooks++;
        } else {
            card.style.display = 'none';
        }
    });

    // Show message if no books found
    showSearchResults(foundBooks, searchTerm);
}

function showSearchResults(count, searchTerm) {
    let messageDiv = document.getElementById('searchMessage');

    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.id = 'searchMessage';
        messageDiv.style.textAlign = 'center';
        messageDiv.style.padding = '20px';
        messageDiv.style.fontSize = '1.2rem';

        const catalogGrid = document.querySelector('.catalog-grid');
        catalogGrid.parentNode.insertBefore(messageDiv, catalogGrid);
    }

    if (count === 0) {
        messageDiv.innerHTML = `<p style="color: #e74c3c;">No books found for "${searchTerm}". Try a different search term.</p>`;
        messageDiv.style.display = 'block';
    } else {
        messageDiv.innerHTML = `<p style="color: #27ae60;">Found ${count} book(s) for "${searchTerm}"</p>`;
        messageDiv.style.display = 'block';
    }
}

// Catalog Filters
function initCatalogFilters() {
    const genreFilter = document.getElementById('genreFilter');
    const authorFilter = document.getElementById('authorFilter');
    const availabilityFilter = document.getElementById('availabilityFilter');
    const clearFiltersBtn = document.getElementById('clearFilters');

    if (genreFilter) {
        genreFilter.addEventListener('change', applyFilters);
    }

    if (authorFilter) {
        authorFilter.addEventListener('input', debounce(applyFilters, 300));
    }

    if (availabilityFilter) {
        availabilityFilter.addEventListener('change', applyFilters);
    }

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }

    // Check URL parameters for search
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam) {
        document.getElementById('searchInput').value = searchParam;
        filterBooksBySearch(searchParam);
    }
}

function applyFilters() {
    const genreFilter = document.getElementById('genreFilter').value.toLowerCase();
    const authorFilter = document.getElementById('authorFilter').value.toLowerCase();
    const availabilityFilter = document.getElementById('availabilityFilter').value;

    const bookCards = document.querySelectorAll('.book-card');
    let visibleBooks = 0;

    bookCards.forEach(card => {
        const genre = card.dataset.genre || '';
        const author = card.dataset.author || '';
        const status = card.dataset.status || '';

        let showCard = true;

        // Genre filter
        if (genreFilter && !genre.includes(genreFilter)) {
            showCard = false;
        }

        // Author filter
        if (authorFilter && !author.toLowerCase().includes(authorFilter)) {
            showCard = false;
        }

        // Availability filter
        if (availabilityFilter && status !== availabilityFilter) {
            showCard = false;
        }

        if (showCard) {
            card.style.display = 'block';
            visibleBooks++;
        } else {
            card.style.display = 'none';
        }
    });

    // Show filter results message
    showFilterResults(visibleBooks);
}

function showFilterResults(count) {
    let messageDiv = document.getElementById('filterMessage');

    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.id = 'filterMessage';
        messageDiv.style.textAlign = 'center';
        messageDiv.style.padding = '10px';
        messageDiv.style.fontSize = '1rem';
        messageDiv.style.color = '#3498db';

        const catalogGrid = document.querySelector('.catalog-grid');
        catalogGrid.parentNode.insertBefore(messageDiv, catalogGrid);
    }

    if (count === 0) {
        messageDiv.innerHTML = '<p>No books match the current filters. Try adjusting your search criteria.</p>';
    } else {
        messageDiv.innerHTML = `<p>Showing ${count} book(s)</p>`;
    }
}

function clearAllFilters() {
    document.getElementById('genreFilter').value = '';
    document.getElementById('authorFilter').value = '';
    document.getElementById('availabilityFilter').value = '';

    // Show all books
    const bookCards = document.querySelectorAll('.book-card');
    bookCards.forEach(card => {
        card.style.display = 'block';
    });

    // Clear messages
    const filterMessage = document.getElementById('filterMessage');
    const searchMessage = document.getElementById('searchMessage');

    if (filterMessage) filterMessage.style.display = 'none';
    if (searchMessage) searchMessage.style.display = 'none';
}

// Contact Form
function initContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            handleContactFormSubmission();
        });
    }
}

function handleContactFormSubmission() {
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);

    // Basic validation
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');

    if (!name || !email || !subject || !message) {
        showFormMessage('Please fill in all required fields.', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showFormMessage('Please enter a valid email address.', 'error');
        return;
    }

    // Simulate form submission
    showFormMessage('Thank you for your message! We will get back to you soon.', 'success');
    form.reset();
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFormMessage(message, type) {
    let messageDiv = document.getElementById('formMessage');

    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.id = 'formMessage';
        messageDiv.style.padding = '15px';
        messageDiv.style.borderRadius = '5px';
        messageDiv.style.marginBottom = '20px';
        messageDiv.style.fontWeight = 'bold';

        const form = document.getElementById('contactForm');
        form.parentNode.insertBefore(messageDiv, form);
    }

    if (type === 'success') {
        messageDiv.style.backgroundColor = '#d4edda';
        messageDiv.style.color = '#155724';
        messageDiv.style.border = '1px solid #c3e6cb';
    } else {
        messageDiv.style.backgroundColor = '#f8d7da';
        messageDiv.style.color = '#721c24';
        messageDiv.style.border = '1px solid #f5c6cb';
    }

    messageDiv.textContent = message;
    messageDiv.style.display = 'block';

    // Hide message after 5 seconds
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// Borrow Button Functionality
function initBorrowButtons() {
    const borrowButtons = document.querySelectorAll('.borrow-btn');

    borrowButtons.forEach(button => {
        if (!button.disabled) {
            button.addEventListener('click', function () {
                handleBorrowBook(this);
            });
        }
    });
}

function handleBorrowBook(button) {
    const bookCard = button.closest('.book-card');
    const bookTitle = bookCard.querySelector('h3').textContent;
    const bookAuthor = bookCard.querySelector('.author').textContent;

    // Simulate borrowing process
    if (confirm(`Would you like to borrow "${bookTitle}" by ${bookAuthor}?`)) {
        // Update button and availability
        button.textContent = 'Borrowed';
        button.disabled = true;
        button.style.backgroundColor = '#bdc3c7';

        const availability = bookCard.querySelector('.availability');
        availability.textContent = 'Borrowed';
        availability.className = 'availability borrowed';

        // Update data attribute
        bookCard.dataset.status = 'borrowed';

        // Show success message
        showBorrowMessage(`Successfully borrowed "${bookTitle}"! Please pick it up within 3 days.`);
    }
}

function showBorrowMessage(message) {
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#27ae60';
    notification.style.color = 'white';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '9999';
    notification.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
    notification.style.maxWidth = '300px';
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animate in
    notification.style.opacity = '0';
    notification.style.transform = 'translateX(100%)';
    notification.style.transition = 'all 0.3s ease';

    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Animations
function initAnimations() {
    // Fade in animation for elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add fade-in class to elements
    const animatedElements = document.querySelectorAll('.book-card, .service-card, .stat-item, .value-card, .team-member');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Mobile Menu Toggle (if needed for responsive design)
function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Book recommendation system (simple example)
function getBookRecommendations(genre) {
    const recommendations = {
        'fiction': ['The Catcher in the Rye', 'Brave New World', 'The Lord of the Rings'],
        'mystery': ['The Girl with the Dragon Tattoo', 'Gone Girl', 'The Da Vinci Code'],
        'romance': ['The Notebook', 'Me Before You', 'The Time Traveler\'s Wife'],
        'sci-fi': ['Dune', 'Ender\'s Game', 'The Hitchhiker\'s Guide to the Galaxy'],
        'biography': ['The Autobiography of Malcolm X', 'Long Walk to Freedom', 'Educated'],
        'history': ['Guns, Germs, and Steel', 'The Guns of August', 'A People\'s History of the United States']
    };

    return recommendations[genre] || [];
}

// Library hours checker
function isLibraryOpen() {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const hour = now.getHours();

    // Library hours: Mon-Fri 9-20, Sat 10-18, Sun 12-17
    if (day >= 1 && day <= 5) { // Monday to Friday
        return hour >= 9 && hour < 20;
    } else if (day === 6) { // Saturday
        return hour >= 10 && hour < 18;
    } else if (day === 0) { // Sunday
        return hour >= 12 && hour < 17;
    }

    return false;
}

// Update library status on page load
document.addEventListener('DOMContentLoaded', function () {
    const statusElements = document.querySelectorAll('.library-status');
    const isOpen = isLibraryOpen();

    statusElements.forEach(element => {
        if (isOpen) {
            element.textContent = 'Library is currently OPEN';
            element.style.color = '#27ae60';
        } else {
            element.textContent = 'Library is currently CLOSED';
            element.style.color = '#e74c3c';
        }
    });
});

// Add library status to footer if element exists
window.addEventListener('load', function () {
    const footerContact = document.querySelector('.footer-section:last-child');
    if (footerContact) {
        const statusP = document.createElement('p');
        statusP.className = 'library-status';
        statusP.style.fontWeight = 'bold';
        statusP.style.marginTop = '10px';
        footerContact.appendChild(statusP);

        // Trigger status update
        const event = new Event('DOMContentLoaded');
        document.dispatchEvent(event);
    }
});

// Initialize View Details Buttons
function initViewDetailsButtons() {
    // Add click event to existing view details buttons
    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('view-details-btn')) {
            const bookCard = e.target.closest('.book-card');
            const bookId = bookCard.getAttribute('data-book-id');

            if (bookId) {
                window.location.href = `book-details.html?book=${bookId}`;
            } else {
                // Fallback: derive ID from book title
                const titleElement = bookCard.querySelector('h3');
                if (titleElement) {
                    const title = titleElement.textContent;
                    const bookId = getBookIdFromTitle(title);
                    window.location.href = `book-details.html?book=${bookId}`;
                }
            }
        }
    });

    // Also make book images and titles clickable
    document.addEventListener('click', function (e) {
        const bookCard = e.target.closest('.book-card');
        if (bookCard && (e.target.tagName === 'IMG' || e.target.tagName === 'H3')) {
            const bookId = bookCard.getAttribute('data-book-id');

            if (bookId) {
                window.location.href = `book-details.html?book=${bookId}`;
            } else {
                // Fallback: derive ID from book title
                const titleElement = bookCard.querySelector('h3');
                if (titleElement) {
                    const title = titleElement.textContent;
                    const bookId = getBookIdFromTitle(title);
                    window.location.href = `book-details.html?book=${bookId}`;
                }
            }
        }
    });
}

// Utility function to generate book ID from title
function getBookIdFromTitle(title) {
    return title.toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .trim();
}

// Enhanced Filter System for Catalog
let activeFilters = {
    genre: '',
    status: '',
    search: ''
};

let allBooks = [];

// Initialize Enhanced Filters
function initEnhancedFilters() {
    if (!document.querySelector('.catalog-filters-enhanced')) return;

    // Initialize filter pills
    initFilterPills();

    // Initialize search functionality
    initEnhancedSearch();

    // Initialize sort dropdown
    initSortDropdown();

    // Initialize clear all button
    initClearAllFilters();

    // Store all books for filtering
    storeAllBooks();

    // Update results count
    updateResultsCount();

    // Initialize quick genre tags
    initQuickGenreTags();
}

function initFilterPills() {
    document.querySelectorAll('.filter-pill').forEach(pill => {
        pill.addEventListener('click', function () {
            const group = this.closest('.filter-pills-group');
            const filterType = group.getAttribute('data-filter');
            const filterValue = this.getAttribute('data-value');

            // Remove active class from siblings
            group.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));

            // Add active class to clicked pill
            this.classList.add('active');

            // Update active filters
            activeFilters[filterType] = filterValue;

            // Apply filters
            applyAllFilters();
            updateActiveFilterTags();
            updateResultsCount();
        });
    });
}

function initEnhancedSearch() {
    const searchInput = document.getElementById('advancedSearchInput');
    const searchBtn = document.getElementById('advancedSearchBtn');
    const clearBtn = document.getElementById('searchClearBtn');

    // Advanced search
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', () => performEnhancedSearch(searchInput.value));
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performEnhancedSearch(searchInput.value);
        });

        // Show/hide clear button
        searchInput.addEventListener('input', () => {
            if (searchInput.value.trim()) {
                clearBtn.classList.add('show');
            } else {
                clearBtn.classList.remove('show');
            }
        });

        // Clear search
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            clearBtn.classList.remove('show');
            activeFilters.search = '';
            applyAllFilters();
            updateActiveFilterTags();
            updateResultsCount();
        });
    }
}

function performEnhancedSearch(searchTerm) {
    activeFilters.search = searchTerm.toLowerCase().trim();
    applyAllFilters();
    updateActiveFilterTags();
    updateResultsCount();
}

function initSortDropdown() {
    const sortDropdown = document.getElementById('sortByEnhanced');
    if (sortDropdown) {
        sortDropdown.addEventListener('change', () => {
            sortBooks(sortDropdown.value);
        });
    }
}

function initClearAllFilters() {
    const clearBtn = document.getElementById('clearAllFilters');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAllFilters);
    }
}

function initQuickGenreTags() {
    document.querySelectorAll('.quick-genre-tag').forEach(tag => {
        tag.addEventListener('click', function () {
            const genre = this.getAttribute('data-genre');

            // Scroll to filters section
            document.querySelector('.catalog-filters-enhanced').scrollIntoView({
                behavior: 'smooth'
            });

            // Set the genre filter
            setTimeout(() => {
                const genreGroup = document.querySelector('[data-filter="genre"]');
                const genrePill = genreGroup.querySelector(`[data-value="${genre}"]`);
                if (genrePill) {
                    genrePill.click();
                }
            }, 500);
        });
    });
}

function storeAllBooks() {
    allBooks = Array.from(document.querySelectorAll('.book-card')).map(card => ({
        element: card,
        title: card.querySelector('h3').textContent.toLowerCase(),
        author: card.querySelector('.author').textContent.toLowerCase(),
        genre: card.getAttribute('data-genre'),
        status: card.getAttribute('data-status'),
        year: card.querySelector('.year').textContent.match(/\d{4}/)?.[0] || '0'
    }));
}

function applyAllFilters() {
    let filteredBooks = [...allBooks];

    // Apply genre filter
    if (activeFilters.genre) {
        filteredBooks = filteredBooks.filter(book =>
            book.genre === activeFilters.genre
        );
    }

    // Apply status filter
    if (activeFilters.status) {
        filteredBooks = filteredBooks.filter(book =>
            book.status === activeFilters.status
        );
    }

    // Apply search filter
    if (activeFilters.search) {
        filteredBooks = filteredBooks.filter(book =>
            book.title.includes(activeFilters.search) ||
            book.author.includes(activeFilters.search) ||
            book.genre.includes(activeFilters.search)
        );
    }

    // Show/hide books
    allBooks.forEach(book => {
        if (filteredBooks.includes(book)) {
            book.element.style.display = 'block';
            book.element.style.animation = 'fadeIn 0.5s ease';
        } else {
            book.element.style.display = 'none';
        }
    });
}

function sortBooks(sortBy) {
    const container = document.getElementById('catalogGrid');
    const books = Array.from(container.children);

    books.sort((a, b) => {
        let aValue, bValue;

        switch (sortBy) {
            case 'title':
                aValue = a.querySelector('h3').textContent;
                bValue = b.querySelector('h3').textContent;
                break;
            case 'author':
                aValue = a.querySelector('.author').textContent;
                bValue = b.querySelector('.author').textContent;
                break;
            case 'year':
                aValue = parseInt(a.querySelector('.year').textContent.match(/\d{4}/)?.[0] || '0');
                bValue = parseInt(b.querySelector('.year').textContent.match(/\d{4}/)?.[0] || '0');
                return bValue - aValue; // Newest first
            case 'year-old':
                aValue = parseInt(a.querySelector('.year').textContent.match(/\d{4}/)?.[0] || '0');
                bValue = parseInt(b.querySelector('.year').textContent.match(/\d{4}/)?.[0] || '0');
                return aValue - bValue; // Oldest first
            case 'popular':
                // Simulate popularity (in real app, this would be based on actual data)
                return Math.random() - 0.5;
            default:
                aValue = a.querySelector('h3').textContent;
                bValue = b.querySelector('h3').textContent;
        }

        if (typeof aValue === 'string') {
            return aValue.localeCompare(bValue);
        }
        return aValue - bValue;
    });

    // Re-append sorted books
    books.forEach(book => container.appendChild(book));
}

function updateActiveFilterTags() {
    const container = document.getElementById('activeFilters');
    container.innerHTML = '';

    Object.entries(activeFilters).forEach(([key, value]) => {
        if (value) {
            const tag = document.createElement('div');
            tag.className = 'active-filter-tag';

            let displayValue = value;
            if (key === 'genre') displayValue = `Genre: ${value}`;
            if (key === 'status') displayValue = `Status: ${value}`;
            if (key === 'search') displayValue = `Search: "${value}"`;

            tag.innerHTML = `
                <span>${displayValue}</span>
                <button class="remove-filter" data-filter="${key}">
                    <i class="fas fa-times"></i>
                </button>
            `;

            container.appendChild(tag);
        }
    });

    // Add click handlers for remove buttons
    container.querySelectorAll('.remove-filter').forEach(btn => {
        btn.addEventListener('click', function () {
            const filterType = this.getAttribute('data-filter');
            removeFilter(filterType);
        });
    });
}

function removeFilter(filterType) {
    activeFilters[filterType] = '';

    // Update UI
    if (filterType === 'genre') {
        const genreGroup = document.querySelector('[data-filter="genre"]');
        genreGroup.querySelector('[data-value=""]').classList.add('active');
        genreGroup.querySelectorAll('[data-value]:not([data-value=""])').forEach(p =>
            p.classList.remove('active')
        );
    } else if (filterType === 'status') {
        const statusGroup = document.querySelector('[data-filter="status"]');
        statusGroup.querySelector('[data-value=""]').classList.add('active');
        statusGroup.querySelectorAll('[data-value]:not([data-value=""])').forEach(p =>
            p.classList.remove('active')
        );
    } else if (filterType === 'search') {
        const searchInput = document.getElementById('advancedSearchInput');
        if (searchInput) {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
        }
    }

    applyAllFilters();
    updateActiveFilterTags();
    updateResultsCount();
}

function clearAllFilters() {
    // Reset all filters
    activeFilters = { genre: '', status: '', search: '' };

    // Reset UI
    document.querySelectorAll('.filter-pill.active').forEach(pill => {
        pill.classList.remove('active');
    });

    document.querySelectorAll('.filter-pills-group').forEach(group => {
        group.querySelector('[data-value=""]').classList.add('active');
    });

    const searchInput = document.getElementById('advancedSearchInput');
    if (searchInput) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
    }

    // Reset sort
    const sortDropdown = document.getElementById('sortByEnhanced');
    if (sortDropdown) {
        sortDropdown.value = 'title';
        sortBooks('title');
    }

    applyAllFilters();
    updateActiveFilterTags();
    updateResultsCount();
}

function updateResultsCount() {
    const visibleBooks = document.querySelectorAll('.book-card[style*="display: block"], .book-card:not([style*="display: none"])');
    const count = visibleBooks.length;
    const countElement = document.getElementById('resultsCount');

    if (countElement) {
        const span = countElement.querySelector('span');
        if (span) {
            span.textContent = `${count} book${count !== 1 ? 's' : ''} found`;
        }
    }
}

// Add CSS animation for fadeIn
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// Initialize enhanced filters when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    initEnhancedFilters();
    initCompactFilters();
});

// Compact Filter System for Catalog
function initCompactFilters() {
    if (!document.querySelector('.catalog-filters-compact')) return;

    const searchInput = document.getElementById('compactSearchInput');
    const genreFilter = document.getElementById('genreFilterCompact');
    const statusFilter = document.getElementById('statusFilterCompact');
    const sortBy = document.getElementById('sortByCompact');
    const clearBtn = document.getElementById('clearAllFilters');
    const searchClearBtn = document.getElementById('searchClearBtn');

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            if (this.value.trim()) {
                searchClearBtn.classList.add('show');
            } else {
                searchClearBtn.classList.remove('show');
            }
            applyCompactFilters();
        });

        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                applyCompactFilters();
            }
        });
    }

    // Clear search
    if (searchClearBtn) {
        searchClearBtn.addEventListener('click', function () {
            searchInput.value = '';
            this.classList.remove('show');
            applyCompactFilters();
        });
    }

    // Filter dropdowns
    if (genreFilter) {
        genreFilter.addEventListener('change', applyCompactFilters);
    }

    if (statusFilter) {
        statusFilter.addEventListener('change', applyCompactFilters);
    }

    if (sortBy) {
        sortBy.addEventListener('change', applySortCompact);
    }

    // Clear all filters
    if (clearBtn) {
        clearBtn.addEventListener('click', function () {
            searchInput.value = '';
            genreFilter.value = '';
            statusFilter.value = '';
            sortBy.value = 'title';
            searchClearBtn.classList.remove('show');
            applyCompactFilters();
            applySortCompact();
        });
    }

    // Initial count
    updateCompactResultsCount();
}

function applyCompactFilters() {
    const searchTerm = document.getElementById('compactSearchInput').value.toLowerCase().trim();
    const genreFilter = document.getElementById('genreFilterCompact').value;
    const statusFilter = document.getElementById('statusFilterCompact').value;
    const bookCards = document.querySelectorAll('.book-card');

    bookCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const author = card.querySelector('.author').textContent.toLowerCase();
        const genre = card.getAttribute('data-genre');
        const status = card.getAttribute('data-status');

        let showCard = true;

        // Search filter
        if (searchTerm &&
            !title.includes(searchTerm) &&
            !author.includes(searchTerm) &&
            !genre.includes(searchTerm)) {
            showCard = false;
        }

        // Genre filter
        if (genreFilter && genre !== genreFilter) {
            showCard = false;
        }

        // Status filter
        if (statusFilter && status !== statusFilter) {
            showCard = false;
        }

        if (showCard) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });

    updateCompactResultsCount();
}

function applySortCompact() {
    const sortBy = document.getElementById('sortByCompact').value;
    const container = document.getElementById('catalogGrid');
    const books = Array.from(container.children);

    books.sort((a, b) => {
        let aValue, bValue;

        switch (sortBy) {
            case 'title':
                aValue = a.querySelector('h3').textContent;
                bValue = b.querySelector('h3').textContent;
                break;
            case 'author':
                aValue = a.querySelector('.author').textContent;
                bValue = b.querySelector('.author').textContent;
                break;
            case 'year':
                aValue = parseInt(a.querySelector('.year').textContent.match(/\d{4}/)?.[0] || '0');
                bValue = parseInt(b.querySelector('.year').textContent.match(/\d{4}/)?.[0] || '0');
                return bValue - aValue;
            default:
                aValue = a.querySelector('h3').textContent;
                bValue = b.querySelector('h3').textContent;
        }

        if (typeof aValue === 'string') {
            return aValue.localeCompare(bValue);
        }
        return aValue - bValue;
    });

    books.forEach(book => container.appendChild(book));
}

function updateCompactResultsCount() {
    const visibleBooks = document.querySelectorAll('.book-card[style*="display: block"], .book-card:not([style*="display: none"])');
    const count = visibleBooks.length;
    const countElement = document.getElementById('resultsCount');

    if (countElement) {
        const span = countElement.querySelector('span');
        if (span) {
            span.textContent = `${count} book${count !== 1 ? 's' : ''}`;
        }
    }
}

// Dynamic Counter Animation for Homepage Stats
function initDynamicCounters() {
    // Generate random numbers for each stat
    const stats = {
        books: Math.floor(Math.random() * 5000) + 12000, // 12,000 - 17,000
        members: Math.floor(Math.random() * 3000) + 7000, // 7,000 - 10,000
        borrowed: Math.floor(Math.random() * 10000) + 20000, // 20,000 - 30,000
    };

    // Update counter elements with new random targets
    const counters = document.querySelectorAll('.counter');
    const counterTargets = [stats.books, stats.members, stats.borrowed];

    counters.forEach((counter, index) => {
        if (counterTargets[index]) {
            counter.setAttribute('data-target', counterTargets[index]);
            counter.textContent = '0';
        }
    });

    // Animate counters when they come into view
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Observe all counter elements
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const timer = setInterval(() => {
        current += increment;

        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// Regenerate stats every 30 seconds for demo purposes
function startStatsRegeneration() {
    setInterval(() => {
        const statsSection = document.querySelector('.library-stats-enhanced');
        if (statsSection && isElementInViewport(statsSection)) {
            // Only regenerate if user is not currently viewing the stats
            return;
        }
        initDynamicCounters();
    }, 30000); // 30 seconds
}

// Helper function to check if element is in viewport
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Initialize dynamic counters when page loads
document.addEventListener('DOMContentLoaded', function () {
    // Check if we're on the homepage
    if (document.querySelector('.library-stats-enhanced')) {
        initDynamicCounters();
        startStatsRegeneration();
    }
});
