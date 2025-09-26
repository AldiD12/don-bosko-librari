import React from 'react';
import libraryData from '../assets/librat.json'; // Adjust the path as necessary
import BookCard from './BookCard'; // Import the BookCard component
import './BookList.css';

// Define the Book interface
interface Book {
  "Nr.": number | string;
  Titulli?: string;
  Autori?: string;
  "Shtepia_Botuese"?: string;
  "Viti_I_Botimit"?: number | string;
  "Nr_Faqe"?: number | string;
  Cmimi?: string | number;
  Kategorizimi?: string;
}

interface CategorizedBooks {
  [key: string]: Book[];
}

interface BookListProps {
  initialBooks?: Book[];
  setFilteredBooks: React.Dispatch<React.SetStateAction<Book[]>>;
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
}

// Define the structure of categorizedBooks
const BookList: React.FC<BookListProps> = ({ initialBooks = [], setFilteredBooks, selectedCategory, setSelectedCategory }) => {
  const categorizedBooks = libraryData as unknown as CategorizedBooks;

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setFilteredBooks([]); // Clear search results when changing category
  };

  // Filter search results by category if needed
  const displayBooks = initialBooks.length > 0 
    ? (selectedCategory === 'Te Gjitha'
      ? initialBooks
      : initialBooks.filter(book => book.Kategorizimi === selectedCategory))
    : (selectedCategory === 'Te Gjitha'
      ? Object.values(categorizedBooks).flat()
      : categorizedBooks[selectedCategory] || []);

  const allCategories: { [key: string]: Book[] } = {
    "Te Gjitha": Object.values(categorizedBooks).flat(),
    ...categorizedBooks
  };

  console.log('Initial Books:', initialBooks); // Debug log
  console.log('Display Books:', displayBooks); // Debug log

  return (
    <div style={{ 
      background: 'linear-gradient(180deg, #1a1a1a 0%, #2d2d2d 5%, #f8f9fa 15%, #ffffff 100%)',
      minHeight: '100vh',
      padding: '20px 0'
    }}>
      {/* Categories Title */}
      <h2 style={{
        textAlign: 'center',
        margin: '40px 0 30px 0',
        fontSize: 'clamp(28px, 5vw, 42px)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        fontWeight: '800',
        background: 'linear-gradient(135deg, #ffc107 0%, #ff8f00 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        letterSpacing: '-0.02em',
        textShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        Kategorite e Librave
      </h2>

      {/* Category Selection Buttons */}
      <div className="categories-container">
        <div className="categories-scroll">
          {Object.keys(allCategories).map((category) => (
            <button
              key={category}
              className="category-button"
              onClick={() => handleCategoryChange(category)}
              style={{
                borderRadius: '25px',
                border: selectedCategory === category ? '2px solid #ffc107' : '2px solid transparent',
                background: selectedCategory === category 
                  ? 'linear-gradient(135deg, #ffc107, #ff8f00)' 
                  : 'linear-gradient(135deg, #ffffff, #f8f9fa)',
                color: selectedCategory === category ? '#1a1a1a' : '#495057',
                cursor: 'pointer',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: selectedCategory === category 
                  ? '0 6px 20px rgba(255, 193, 7, 0.4)' 
                  : '0 2px 8px rgba(0, 0, 0, 0.08)',
                transform: selectedCategory === category ? 'translateY(-2px)' : 'translateY(0)',
                minWidth: 'fit-content',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                if (selectedCategory !== category) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #f8f9fa, #e9ecef)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.12)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== category) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #ffffff, #f8f9fa)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
                }
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Books Grid */}
      <div className="books-grid">
        {displayBooks.map((book: Book, index: number) => (
          <BookCard 
            key={`${book["Nr."]}-${book.Titulli}-${index}`} 
            book={book} 
          />
        ))}
      </div>
    </div>
  );
};

export default BookList;
