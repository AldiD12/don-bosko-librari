import { useState, useRef } from 'react';
import Hero from './components/Hero';
import BookList from './components/BookList';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

interface Book {
  "Nr."?: number | string;
  "NR."?: number | string;
  Titulli?: string;
  "TITULLI"?: string;
  Autori?: string;
  "AUTORI"?: string;
  "Shtepia_Botuese"?: string;
  "SHTEPIA BOTUESE"?: string;
  "Shtepia botuese"?: string;
  "Viti_I_Botimit"?: number | string;
  "VITI I BOTIMIT"?: number | string;
  "Viti i botimit"?: number | string;
  "Nr_Faqe"?: number | string;
  "NR FAQE"?: number | string;
  "Nr faqe"?: number | string;
  Cmimi?: string | number;
  "CMIMI"?: string | number;
  Kategorizimi?: string;
  "KATEGORIZIMI"?: string;
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
