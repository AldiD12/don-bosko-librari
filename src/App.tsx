import { useState, useRef } from 'react';
import Hero from './components/Hero';
import BookList from './components/BookList';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

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

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Te Gjitha');
  const resultsRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Hero 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        resultsRef={resultsRef}
        setFilteredBooks={setFilteredBooks}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <BookList 
        initialBooks={filteredBooks} 
        setFilteredBooks={setFilteredBooks}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
    </>
  );
}

export default App;
