// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize all functionality
    initSearchFunction();
    initCatalogFilters();
    initContactForm();
    initAnimations();
    initBorrowButtons();
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
