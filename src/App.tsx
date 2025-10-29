import { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import BookList from './components/BookList';
import AdminPage from './pages/AdminPage';
import NotFound from './pages/NotFound';
import NotificationSystem from './components/NotificationSystem';
import { getLibraryData, LibraryData, Book } from './utils/dataManager';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';



// Main Library Component
const LibraryApp: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Te Gjitha');
  const [libraryData, setLibraryData] = useState<LibraryData>(getLibraryData());
  const resultsRef = useRef<HTMLDivElement>(null);

  // Listen for data updates from admin panel
  useEffect(() => {
    const handleDataUpdate = (event: CustomEvent) => {
      setLibraryData(event.detail.data);
      // Clear search results when data changes
      setFilteredBooks([]);
      setSearchQuery('');
    };

    window.addEventListener('libraryDataUpdated', handleDataUpdate as EventListener);
    
    return () => {
      window.removeEventListener('libraryDataUpdated', handleDataUpdate as EventListener);
    };
  }, []);

  return (
    <>
      <Hero 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        resultsRef={resultsRef}
        setFilteredBooks={setFilteredBooks}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        libraryData={libraryData}
      />
      <BookList 
        initialBooks={filteredBooks} 
        setFilteredBooks={setFilteredBooks}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        libraryData={libraryData}
      />
    </>
  );
};

function App() {
  return (
    <Router>
      <NotificationSystem />
      <Routes>
        <Route path="/" element={<LibraryApp />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
