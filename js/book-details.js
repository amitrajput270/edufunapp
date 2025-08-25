// Book Details JavaScript - Enhanced
document.addEventListener('DOMContentLoaded', function () {
    initBookDetails();
    initBookActions();
    initRelatedBooks();
    initEnhancedFeatures();
});

// Enhanced initialization for new features
function initEnhancedFeatures() {
    // Add ripple effect to buttons
    initRippleEffect();

    // Initialize read more functionality
    initReadMore();

    // Add smooth hover animations
    initHoverAnimations();

    // Initialize book cover glow effect
    initBookCoverEffects();
}

// Add ripple effect to buttons
function initRippleEffect() {
    document.querySelectorAll('.borrow-btn-large').forEach(button => {
        button.addEventListener('click', function (e) {
            const ripple = this.querySelector('.btn-ripple');
            if (ripple) {
                ripple.style.width = '300px';
                ripple.style.height = '300px';

                setTimeout(() => {
                    ripple.style.width = '0';
                    ripple.style.height = '0';
                }, 300);
            }
        });
    });
}

// Initialize read more functionality
function initReadMore() {
    const readMoreBtn = document.querySelector('.read-more-btn');
    const descriptionContent = document.querySelector('.description-content p');

    if (readMoreBtn && descriptionContent) {
        const fullText = descriptionContent.textContent;
        const shortText = fullText.substring(0, 200) + '...';
        let isExpanded = false;

        // Initially show short text
        descriptionContent.textContent = shortText;

        readMoreBtn.addEventListener('click', function () {
            if (isExpanded) {
                descriptionContent.textContent = shortText;
                readMoreBtn.innerHTML = '<i class="fas fa-book-open"></i> Read More';
                isExpanded = false;
            } else {
                descriptionContent.textContent = fullText;
                readMoreBtn.innerHTML = '<i class="fas fa-book"></i> Read Less';
                isExpanded = true;
            }
        });
    }
}

// Initialize hover animations
function initHoverAnimations() {
    // Add stagger animation to meta items
    const metaItems = document.querySelectorAll('.meta-item');
    metaItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.classList.add('fade-in-up');
    });

    // Add hover sound effect (optional)
    document.querySelectorAll('.book-cover, .borrow-btn-large, .wishlist-btn, .share-btn').forEach(element => {
        element.addEventListener('mouseenter', function () {
            this.style.transform = this.style.transform || 'translateY(0)';
        });
    });
}

// Initialize book cover effects
function initBookCoverEffects() {
    const bookCover = document.querySelector('.book-cover');
    if (bookCover) {
        // Add parallax effect on mouse move
        bookCover.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            this.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        bookCover.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
        });
    }
}

// Sample book data (in a real application, this would come from a database)
const booksData = {
    'to-kill-a-mockingbird': {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        genre: 'Fiction',
        year: '1960',
        isbn: '978-0-06-112008-4',
        pages: '281',
        language: 'English',
        status: 'available',
        publisher: 'J.B. Lippincott & Co.',
        edition: '1st Edition',
        location: 'A-12',
        callNumber: '813.54 LEE',
        copies: '2 of 3',
        image: 'https://picsum.photos/300/450?random=11',
        description: 'Set in the fictional town of Maycomb, Alabama, during the 1930s, the story is narrated by Jean Louise "Scout" Finch, who recalls her childhood experiences when her father, Atticus Finch, served as a lawyer defending a black man accused of rape. The novel explores themes of racial injustice, moral growth, and the loss of innocence through the eyes of a young girl coming of age in the American South.',
        rating: 4.5,
        reviews: 342
    },
    '1984': {
        title: '1984',
        author: 'George Orwell',
        genre: 'Dystopian Fiction',
        year: '1949',
        isbn: '978-0-452-28423-4',
        pages: '328',
        language: 'English',
        status: 'available',
        publisher: 'Secker & Warburg',
        edition: '1st Edition',
        location: 'B-8',
        callNumber: '823.912 ORW',
        copies: '4 of 5',
        image: 'https://picsum.photos/300/450?random=12',
        description: 'A dystopian social science fiction novel that follows the life of Winston Smith, a low-ranking member of the ruling Party in Oceania, one of the three superstates into which the world is divided. Everywhere Winston goes, even his own home, the Party watches him through telescreens; everywhere he looks he sees the face of the Party\'s seemingly omniscient leader, Big Brother.',
        rating: 4.3,
        reviews: 287
    },
    'pride-and-prejudice': {
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        genre: 'Romance',
        year: '1813',
        isbn: '978-0-14-143951-8',
        pages: '432',
        language: 'English',
        status: 'borrowed',
        publisher: 'T. Egerton',
        edition: '1st Edition',
        location: 'C-15',
        callNumber: '823.7 AUS',
        copies: '0 of 2',
        image: 'https://picsum.photos/300/450?random=13',
        description: 'The story follows the main character Elizabeth Bennet as she deals with issues of manners, upbringing, morality, education, and marriage in the society of the landed gentry of early 19th-century England. Elizabeth is the second of five daughters of a country gentleman living near the fictional town of Meryton in Hertfordshire.',
        rating: 4.4,
        reviews: 198
    },
    'the-great-gatsby': {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        genre: 'Fiction',
        year: '1925',
        isbn: '978-0-7432-7356-5',
        pages: '180',
        language: 'English',
        status: 'available',
        publisher: 'Charles Scribner\'s Sons',
        edition: '1st Edition',
        location: 'A-20',
        callNumber: '813.52 FIT',
        copies: '3 of 4',
        image: 'https://picsum.photos/300/450?random=14',
        description: 'Set in the summer of 1922, the novel follows Nick Carraway, a young Midwesterner who moves to Long Island, where he becomes neighbors with the mysterious millionaire Jay Gatsby. The story explores themes of decadence, idealism, resistance to change, social upheaval, and excess, creating a portrait of the Jazz Age.',
        rating: 4.1,
        reviews: 156
    },
    'dune': {
        title: 'Dune',
        author: 'Frank Herbert',
        genre: 'Science Fiction',
        year: '1965',
        isbn: '978-0-441-17271-9',
        pages: '688',
        language: 'English',
        status: 'available',
        publisher: 'Chilton Books',
        edition: '1st Edition',
        location: 'D-5',
        callNumber: '813.54 HER',
        copies: '1 of 2',
        image: 'https://picsum.photos/300/450?random=15',
        description: 'Set in the distant future amidst a feudal interstellar society in which various noble houses control planetary fiefs. The story follows Paul Atreides, whose family accepts the stewardship of the planet Arrakis. While the planet is an inhospitable and sparsely populated desert wasteland, it is the only source of melange, or "spice," a drug that extends life and enhances mental abilities.',
        rating: 4.6,
        reviews: 289
    },
    'the-hobbit': {
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        genre: 'Fantasy',
        year: '1937',
        isbn: '978-0-547-92822-7',
        pages: '310',
        language: 'English',
        status: 'available',
        publisher: 'George Allen & Unwin',
        edition: '1st Edition',
        location: 'F-10',
        callNumber: '823.912 TOL',
        copies: '2 of 3',
        image: 'https://picsum.photos/300/450?random=16',
        description: 'The story follows the quest of home-loving Bilbo Baggins, a hobbit, to win a share of the treasure guarded by a dragon named Smaug. Bilbo\'s journey takes him from his light-hearted, rural surroundings into more sinister territory, where he gains a new level of maturity, competence, and wisdom.',
        rating: 4.7,
        reviews: 412
    },
    'murder-on-the-orient-express': {
        title: 'Murder on the Orient Express',
        author: 'Agatha Christie',
        genre: 'Mystery',
        year: '1934',
        isbn: '978-0-06-207350-4',
        pages: '256',
        language: 'English',
        status: 'borrowed',
        publisher: 'Collins Crime Club',
        edition: '1st Edition',
        location: 'M-3',
        callNumber: '823.912 CHR',
        copies: '0 of 1',
        image: 'https://picsum.photos/300/450?random=17',
        description: 'Belgian detective Hercule Poirot investigates the murder of an American businessman aboard the Orient Express train. The victim is found stabbed to death in his locked compartment, and Poirot must solve the case before the train reaches its destination, using his little grey cells to uncover the truth.',
        rating: 4.2,
        reviews: 234
    },
    'a-brief-history-of-time': {
        title: 'A Brief History of Time',
        author: 'Stephen Hawking',
        genre: 'Science',
        year: '1988',
        isbn: '978-0-553-10953-5',
        pages: '256',
        language: 'English',
        status: 'available',
        publisher: 'Bantam Books',
        edition: '1st Edition',
        location: 'S-7',
        callNumber: '523.1 HAW',
        copies: '3 of 4',
        image: 'https://picsum.photos/300/450?random=18',
        description: 'A landmark volume in science writing by one of the great minds of our time, Stephen Hawking\'s book explores such profound questions as: How did the universe begin—and what made its start possible? Does time always flow forward? Is the universe unending—or are there boundaries? Are there other dimensions in space?',
        rating: 4.4,
        reviews: 267
    },
    'becoming': {
        title: 'Becoming',
        author: 'Michelle Obama',
        genre: 'Biography',
        year: '2018',
        isbn: '978-1-5247-6313-8',
        pages: '448',
        language: 'English',
        status: 'available',
        publisher: 'Crown Publishing',
        edition: '1st Edition',
        location: 'B-25',
        callNumber: '973.932 OBA',
        copies: '5 of 6',
        image: 'https://picsum.photos/300/450?random=19',
        description: 'In her memoir, a work of deep reflection and mesmerizing storytelling, Michelle Obama invites readers into her world, chronicling the experiences that have shaped her—from her childhood on the South Side of Chicago to her years as an executive balancing the demands of motherhood and work, to her time spent at the world\'s most famous address.',
        rating: 4.8,
        reviews: 523
    }
};

function initBookDetails() {
    // Get book ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('book') || urlParams.get('id');

    if (bookId && booksData[bookId]) {
        populateBookDetails(booksData[bookId]);
    } else {
        // If no book ID or invalid ID, show default/error state
        showBookNotFound();
    }
}

function populateBookDetails(book) {
    // Update page title
    document.title = `${book.title} - EduFun Library`;

    // Update breadcrumb
    document.getElementById('bookTitleBreadcrumb').textContent = book.title;

    // Update book image
    const bookImage = document.getElementById('bookImage');
    bookImage.src = book.image;
    bookImage.alt = book.title;

    // Update book information
    document.getElementById('bookTitle').textContent = book.title;
    document.getElementById('bookAuthor').textContent = book.author;
    document.getElementById('bookGenre').textContent = book.genre;
    document.getElementById('bookYear').textContent = book.year;
    document.getElementById('bookISBN').textContent = book.isbn;
    document.getElementById('bookPages').textContent = book.pages;
    document.getElementById('bookLanguage').textContent = book.language;
    document.getElementById('bookPublisher').textContent = book.publisher;
    document.getElementById('bookEdition').textContent = book.edition;
    document.getElementById('bookDescription').textContent = book.description;

    // Update availability status
    const statusElement = document.getElementById('bookStatus');
    statusElement.textContent = book.status === 'available' ? 'Available' : 'Borrowed';
    statusElement.className = `availability ${book.status}`;

    // Update borrow button
    const borrowBtn = document.getElementById('borrowBtn');
    if (book.status === 'available') {
        borrowBtn.innerHTML = '<i class="fas fa-book-reader"></i> Borrow Book';
        borrowBtn.disabled = false;
        borrowBtn.className = 'borrow-btn-large';
    } else {
        borrowBtn.innerHTML = '<i class="fas fa-clock"></i> Not Available';
        borrowBtn.disabled = true;
        borrowBtn.className = 'borrow-btn-large disabled';
    }

    // Update rating
    updateRating(book.rating, book.reviews);
}

function updateRating(rating, reviewCount) {
    const starsContainer = document.querySelector('.stars');
    const ratingText = document.querySelector('.rating-text');

    // Clear existing stars
    starsContainer.innerHTML = '';

    // Add stars based on rating
    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('i');
        if (i <= Math.floor(rating)) {
            star.className = 'fas fa-star';
        } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
            star.className = 'fas fa-star-half-alt';
        } else {
            star.className = 'far fa-star';
        }
        starsContainer.appendChild(star);
    }

    // Update rating text
    ratingText.textContent = `(${rating}/5 - ${reviewCount} reviews)`;
}

function showBookNotFound() {
    document.getElementById('bookTitle').textContent = 'Book Not Found';
    document.getElementById('bookAuthor').textContent = 'Unknown';
    document.getElementById('bookDescription').textContent = 'Sorry, the requested book could not be found. Please check the URL or browse our catalog for available books.';

    // Hide borrow button
    document.getElementById('borrowBtn').style.display = 'none';
}

function initBookActions() {
    // Borrow button
    document.getElementById('borrowBtn').addEventListener('click', function () {
        if (!this.disabled) {
            handleBorrowBook();
        }
    });

    // Wishlist button
    document.getElementById('wishlistBtn').addEventListener('click', function () {
        handleWishlist();
    });

    // Share button
    document.getElementById('shareBtn').addEventListener('click', function () {
        handleShare();
    });

    // Load more reviews button
    document.querySelector('.load-more-reviews').addEventListener('click', function () {
        loadMoreReviews();
    });
}

function handleBorrowBook() {
    const bookTitle = document.getElementById('bookTitle').textContent;

    // Simulate borrowing process
    if (confirm(`Do you want to borrow "${bookTitle}"?`)) {
        // Update UI to show borrowed state
        const statusElement = document.getElementById('bookStatus');
        statusElement.textContent = 'Borrowed';
        statusElement.className = 'availability borrowed';

        const borrowBtn = document.getElementById('borrowBtn');
        borrowBtn.innerHTML = '<i class="fas fa-clock"></i> Not Available';
        borrowBtn.disabled = true;
        borrowBtn.className = 'borrow-btn-large disabled';

        alert(`"${bookTitle}" has been added to your borrowed books! Please pick it up within 3 days.`);
    }
}

function handleWishlist() {
    const wishlistBtn = document.getElementById('wishlistBtn');
    const bookTitle = document.getElementById('bookTitle').textContent;

    if (wishlistBtn.querySelector('i').classList.contains('far')) {
        // Add to wishlist
        wishlistBtn.innerHTML = '<i class="fas fa-heart"></i> Remove from Wishlist';
        wishlistBtn.classList.add('active');
        alert(`"${bookTitle}" has been added to your wishlist!`);
    } else {
        // Remove from wishlist
        wishlistBtn.innerHTML = '<i class="far fa-heart"></i> Add to Wishlist';
        wishlistBtn.classList.remove('active');
        alert(`"${bookTitle}" has been removed from your wishlist.`);
    }
}

function handleShare() {
    const bookTitle = document.getElementById('bookTitle').textContent;
    const bookAuthor = document.getElementById('bookAuthor').textContent;
    const currentUrl = window.location.href;

    if (navigator.share) {
        // Use native sharing if available
        navigator.share({
            title: `${bookTitle} by ${bookAuthor}`,
            text: `Check out this book: ${bookTitle} by ${bookAuthor}`,
            url: currentUrl
        }).catch(console.error);
    } else {
        // Fallback to copying URL
        navigator.clipboard.writeText(currentUrl).then(() => {
            alert('Book link copied to clipboard!');
        }).catch(() => {
            // Fallback if clipboard API is not available
            prompt('Copy this link:', currentUrl);
        });
    }
}

function loadMoreReviews() {
    const reviewsContainer = document.querySelector('.reviews-container');
    const loadMoreBtn = document.querySelector('.load-more-reviews');

    // Sample additional reviews
    const additionalReviews = [
        {
            name: 'David Wilson',
            rating: 4,
            date: 'December 5, 2023',
            text: 'Engaging plot with well-developed characters. The author does an excellent job of building tension throughout the story.'
        },
        {
            name: 'Lisa Thompson',
            rating: 5,
            date: 'November 18, 2023',
            text: 'One of the best books I\'ve read this year! Highly recommend to anyone who enjoys this genre. The ending was particularly satisfying.'
        }
    ];

    additionalReviews.forEach(review => {
        const reviewElement = createReviewElement(review);
        reviewsContainer.appendChild(reviewElement);
    });

    // Hide load more button after loading
    loadMoreBtn.style.display = 'none';
}

function createReviewElement(review) {
    const reviewDiv = document.createElement('div');
    reviewDiv.className = 'review-item';

    const stars = Array(5).fill().map((_, i) =>
        i < review.rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>'
    ).join('');

    reviewDiv.innerHTML = `
        <div class="review-header">
            <div class="reviewer-info">
                <strong>${review.name}</strong>
                <div class="review-stars">${stars}</div>
            </div>
            <span class="review-date">${review.date}</span>
        </div>
        <p class="review-text">${review.text}</p>
    `;

    return reviewDiv;
}

function initRelatedBooks() {
    const urlParams = new URLSearchParams(window.location.search);
    const currentBookId = urlParams.get('book') || urlParams.get('id');
    const currentBook = booksData[currentBookId];

    if (!currentBook) return;

    // Find related books (same genre or author)
    const relatedBooks = Object.entries(booksData)
        .filter(([id, book]) =>
            id !== currentBookId &&
            (book.genre === currentBook.genre || book.author === currentBook.author)
        )
        .slice(0, 4); // Show max 4 related books

    const relatedBooksGrid = document.getElementById('relatedBooksGrid');

    if (relatedBooks.length === 0) {
        relatedBooksGrid.innerHTML = '<p>No related books found.</p>';
        return;
    }

    relatedBooks.forEach(([id, book]) => {
        const bookElement = createRelatedBookElement(id, book);
        relatedBooksGrid.appendChild(bookElement);
    });
}

function createRelatedBookElement(id, book) {
    const bookDiv = document.createElement('div');
    bookDiv.className = 'related-book-card';

    bookDiv.innerHTML = `
        <img src="${book.image}" alt="${book.title}"
            onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjIyNSIgdmlld0JveD0iMCAwIDE1MCAyMjUiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMjI1IiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik03Mi41IDY3LjVMNzcuNSA2Ny41TDc3LjUgNzguNUw3Mi41IDc4LjVaIiBmaWxsPSIjQzRDNEM0Ii8+CjxwYXRoIGQ9Ik02NC41IDc1TDg1LjUgNzVMODUuNSA3OUw2NC41IDc5WiIgZmlsbD0iI0M0QzRDNCIvPgo8dGV4dCB4PSI3NSIgeT0iMTIwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkJvb2s8L3RleHQ+Cjwvc3ZnPg=='">
        <div class="related-book-info">
            <h4>${book.title}</h4>
            <p>${book.author}</p>
            <p class="genre">${book.genre}</p>
        </div>
    `;

    // Add click event to navigate to book details
    bookDiv.addEventListener('click', () => {
        window.location.href = `book-details.html?book=${id}`;
    });

    return bookDiv;
}

// Utility function to get book ID from title (for backward compatibility)
function getBookIdFromTitle(title) {
    return title.toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .trim();
}
