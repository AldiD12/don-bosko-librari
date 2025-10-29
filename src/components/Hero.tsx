import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import SHELF from '../assets/SHELF.jpg';
import { Book, LibraryData } from '../utils/dataManager';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  resultsRef: React.RefObject<HTMLDivElement>;
  setFilteredBooks: (books: Book[]) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  libraryData: LibraryData;
}



const Hero: React.FC<HeroSectionProps> = ({ 
  setSearchQuery, 
  resultsRef,
  setFilteredBooks,
  setSelectedCategory,
  libraryData
}) => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [inputValue, setInputValue] = useState('');

  const handleSearch = () => {
    setSearchQuery(inputValue);
    
    if (!inputValue.trim()) {
      setFilteredBooks([]);
      return;
    }

    const searchTerm = inputValue.toLowerCase().trim();
    const allBooks = Object.values(libraryData).flat();
    
    const filtered = allBooks.filter(book => 
      (book.Titulli || book.TITULLI)?.toLowerCase().includes(searchTerm) ||
      (book.Autori || book.AUTORI)?.toLowerCase().includes(searchTerm) ||
      (book.Shtepia_Botuese || book["SHTEPIA BOTUESE"] || book["Shtepia botuese"])?.toLowerCase().includes(searchTerm)
    );

    setFilteredBooks(filtered);
    setSelectedCategory('Te Gjitha');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedCategory('Te Gjitha'); // Reset to "Te Gjitha" before searching
    handleSearch();
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const clearSearch = () => {
    setInputValue('');
    setSearchQuery('');
    setFilteredBooks([]);
  };

  const handleScroll = () => {
    if (window.scrollY > lastScrollY) {
      setShowNavbar(false); // Scrolling down
    } else {
      setShowNavbar(true); // Scrolling up
    }
    setLastScrollY(window.scrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); // Cleanup on unmount
  }, [lastScrollY]);

  return (
    <div>
      <div 
        className="hero-section d-flex justify-content-center align-items-center text-center text-light vh-100 w-100 position-relative"
        style={{ 
          backgroundImage: `url(${SHELF})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <nav
          className={`navbar navbar-dark bg-green position-absolute top-0 shadow ${showNavbar ? 'navbar-show' : 'navbar-hide'}`}
        >
          <div className="container d-flex justify-content-start">
            <img className="logo" src="/logo.png" alt="Logo" />
            <a className="navbar-brand fw-bold text-light fs-3" href="#">
              Qendra Don Bosko
            </a>
          </div>
        </nav>

        <div className="overlay position-absolute w-100 h-100 bg-black opacity-50"></div>
        <div className="container position-relative z-index-2">
          <h1 className="display-3 fw-bold mb-4">Mirë se erdhët në bibliotekën <br /> "Don Bosko"</h1>
          <p className="lead mb-4">
            Shkolla jonë ofron një koleksion të pasur burimesh për të mësuar dhe rritur njohuritë tuaja.
          </p>
          <form className="d-flex justify-content-center mb-4" onSubmit={handleSubmit}>
            <div className="position-relative w-75 w-md-50">
              <input
                type="text"
                className="form-control p-3 fs-5"
                placeholder="Kërko për titull, autor ose shtëpi botuese..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              {inputValue && (
                <button
                  type="button"
                  className="btn position-absolute end-0 top-50 translate-middle-y px-2 py-0"
                  style={{ border: 'none', background: 'transparent' }}
                  onClick={clearSearch}
                >
                  <i className="bi bi-backspace w-50 h-75"></i>
                </button>
              )}
            </div>
            <button type="submit" className="btn btn-warning px-4 py-2 fs-5 ms-2">
              Search
            </button>
          </form>
        </div>

        <div ref={resultsRef}></div>
      </div>
    </div>
  );
};

export default Hero;
