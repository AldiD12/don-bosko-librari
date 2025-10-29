import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSave, faTimes, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import AdminLogin from './AdminLogin';
import { Book, LibraryData } from '../utils/dataManager';
import './AdminPanel.css';

interface AdminPanelProps {
  libraryData: LibraryData;
  onDataUpdate: (newData: LibraryData) => void;
  isFullPage?: boolean;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ libraryData, onDataUpdate, isFullPage = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newBook, setNewBook] = useState<Book>({});
  const [newCategory, setNewCategory] = useState('');

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      const authData = localStorage.getItem('donBosko_admin_auth');
      if (authData) {
        try {
          const parsed = JSON.parse(authData);
          if (parsed.expires > Date.now()) {
            setCurrentUser(parsed.username);
            return;
          } else {
            // Token expired
            localStorage.removeItem('donBosko_admin_auth');
          }
        } catch (error) {
          localStorage.removeItem('donBosko_admin_auth');
        }
      }
      setCurrentUser('');
    };

    checkAuth();
  }, []);

  const handleLogin = (authenticated: boolean) => {
    if (authenticated) {
      const authData = localStorage.getItem('donBosko_admin_auth');
      if (authData) {
        const parsed = JSON.parse(authData);
        setCurrentUser(parsed.username);
      }
      setShowLogin(false);
      setIsVisible(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('donBosko_admin_auth');
    setCurrentUser('');
    setIsVisible(false);
    setShowLogin(false);
    
    if (isFullPage) {
      window.location.href = '/';
    }
  };



  const categories = Object.keys(libraryData);

  const handleAddBook = () => {
    if (!selectedCategory) {
      alert('Please select a category first');
      return;
    }
    
    const updatedData = { ...libraryData };
    const categoryBooks = updatedData[selectedCategory] || [];
    const newId = Math.max(...categoryBooks.map(book => Number(book["Nr."] || book["NR."] || 0)), 0) + 1;
    
    const bookToAdd = {
      ...newBook,
      "Nr.": newId,
      Kategorizimi: selectedCategory
    };
    
    updatedData[selectedCategory] = [...categoryBooks, bookToAdd];
    onDataUpdate(updatedData);
    
    setNewBook({});
    setIsAddingNew(false);
  };

  const handleEditBook = (book: Book) => {
    setEditingBook({ ...book });
  };

  const handleSaveEdit = () => {
    if (!editingBook || !selectedCategory) return;
    
    const updatedData = { ...libraryData };
    const categoryBooks = updatedData[selectedCategory] || [];
    const bookIndex = categoryBooks.findIndex(book => 
      (book["Nr."] || book["NR."]) === (editingBook["Nr."] || editingBook["NR."])
    );
    
    if (bookIndex !== -1) {
      categoryBooks[bookIndex] = editingBook;
      updatedData[selectedCategory] = categoryBooks;
      onDataUpdate(updatedData);
    }
    
    setEditingBook(null);
  };

  const handleDeleteBook = (bookToDelete: Book) => {
    if (!selectedCategory) return;
    if (!confirm('Are you sure you want to delete this book?')) return;
    
    const updatedData = { ...libraryData };
    const categoryBooks = updatedData[selectedCategory] || [];
    const filteredBooks = categoryBooks.filter(book => 
      (book["Nr."] || book["NR."]) !== (bookToDelete["Nr."] || bookToDelete["NR."])
    );
    
    updatedData[selectedCategory] = filteredBooks;
    onDataUpdate(updatedData);
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    if (libraryData[newCategory]) {
      alert('Category already exists');
      return;
    }
    
    const updatedData = { ...libraryData, [newCategory]: [] };
    onDataUpdate(updatedData);
    setNewCategory('');
    setSelectedCategory(newCategory);
  };

  const handleDeleteCategory = (categoryToDelete: string) => {
    // Prevent deletion of categories with books
    const categoryBooks = libraryData[categoryToDelete] || [];
    if (categoryBooks.length > 0) {
      const confirmDelete = confirm(
        `Category "${categoryToDelete}" contains ${categoryBooks.length} book(s). Deleting this category will also delete all books in it. Are you sure you want to continue?`
      );
      if (!confirmDelete) return;
    } else {
      const confirmDelete = confirm(`Are you sure you want to delete the category "${categoryToDelete}"?`);
      if (!confirmDelete) return;
    }
    
    const updatedData = { ...libraryData };
    delete updatedData[categoryToDelete];
    onDataUpdate(updatedData);
    
    // Reset selected category if it was the deleted one
    if (selectedCategory === categoryToDelete) {
      setSelectedCategory('');
    }
  };

  const currentBooks = selectedCategory ? libraryData[selectedCategory] || [] : [];

  // For full page mode, always show the panel if authenticated
  if (isFullPage) {
    return (
      <div className="admin-overlay">
        <div className="admin-panel">
          <div className="admin-header">
            <div className="admin-title">
              <h2>Don Bosko Library - Admin Panel</h2>
              <span className="user-info">Welcome, {currentUser}</span>
            </div>
            <div className="header-actions">
              <button 
                className="logout-btn"
                onClick={handleLogout}
                title="Logout & Return to Library"
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
              </button>
            </div>
          </div>
          <div className="admin-content">
            {/* Category Management */}
            <div className="category-section">
              <h3>Categories</h3>
              <div className="category-controls">
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="category-select"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                
                <div className="add-category">
                  <input
                    type="text"
                    placeholder="New category name"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="category-input"
                  />
                  <button onClick={handleAddCategory} className="add-btn">
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              </div>

              {/* Category List with Delete Options */}
              <div className="categories-list">
                <h4>Manage Categories</h4>
                <div className="categories-grid">
                  {categories.map(category => {
                    const bookCount = libraryData[category]?.length || 0;
                    return (
                      <div key={category} className="category-item">
                        <div className="category-info">
                          <span className="category-name">{category}</span>
                          <span className="category-count">({bookCount} books)</span>
                        </div>
                        <button 
                          onClick={() => handleDeleteCategory(category)}
                          className="delete-category-btn"
                          title={`Delete category "${category}"`}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Book Management */}
            {selectedCategory && (
              <div className="books-section">
                <div className="books-header">
                  <h3>Books in {selectedCategory} ({currentBooks.length})</h3>
                  <button 
                    onClick={() => setIsAddingNew(true)} 
                    className="add-book-btn"
                  >
                    <FontAwesomeIcon icon={faPlus} /> Add Book
                  </button>
                </div>

                {/* Add New Book Form */}
                {isAddingNew && (
                  <div className="book-form">
                    <h4>Add New Book</h4>
                    <div className="form-grid">
                      <input
                        type="text"
                        placeholder="Title"
                        value={newBook.Titulli || ''}
                        onChange={(e) => setNewBook({...newBook, Titulli: e.target.value})}
                      />
                      <input
                        type="text"
                        placeholder="Author"
                        value={newBook.Autori || ''}
                        onChange={(e) => setNewBook({...newBook, Autori: e.target.value})}
                      />
                      <input
                        type="text"
                        placeholder="Publisher"
                        value={newBook["Shtepia botuese"] || ''}
                        onChange={(e) => setNewBook({...newBook, "Shtepia botuese": e.target.value})}
                      />
                      <input
                        type="text"
                        placeholder="Year"
                        value={newBook["Viti i botimit"] || ''}
                        onChange={(e) => setNewBook({...newBook, "Viti i botimit": e.target.value})}
                      />
                      <input
                        type="text"
                        placeholder="Pages"
                        value={newBook["Nr faqe"] || ''}
                        onChange={(e) => setNewBook({...newBook, "Nr faqe": e.target.value})}
                      />
                      <input
                        type="text"
                        placeholder="Price"
                        value={newBook.Cmimi || ''}
                        onChange={(e) => setNewBook({...newBook, Cmimi: e.target.value})}
                      />
                    </div>
                    <div className="form-actions">
                      <button onClick={handleAddBook} className="save-btn">
                        <FontAwesomeIcon icon={faSave} /> Save
                      </button>
                      <button onClick={() => setIsAddingNew(false)} className="cancel-btn">
                        <FontAwesomeIcon icon={faTimes} /> Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Books List */}
                <div className="books-list">
                  {currentBooks.map((book, index) => (
                    <div key={index} className="book-item">
                      {editingBook && (editingBook["Nr."] || editingBook["NR."]) === (book["Nr."] || book["NR."]) ? (
                        // Edit Mode
                        <div className="book-form">
                          <div className="form-grid">
                            <input
                              type="text"
                              value={editingBook.Titulli || editingBook.TITULLI || ''}
                              onChange={(e) => setEditingBook({...editingBook, Titulli: e.target.value})}
                              placeholder="Title"
                            />
                            <input
                              type="text"
                              value={editingBook.Autori || editingBook.AUTORI || ''}
                              onChange={(e) => setEditingBook({...editingBook, Autori: e.target.value})}
                              placeholder="Author"
                            />
                            <input
                              type="text"
                              value={editingBook["Shtepia botuese"] || editingBook["SHTEPIA BOTUESE"] || editingBook["Shtepia_Botuese"] || ''}
                              onChange={(e) => setEditingBook({...editingBook, "Shtepia botuese": e.target.value})}
                              placeholder="Publisher"
                            />
                            <input
                              type="text"
                              value={editingBook["Viti i botimit"] || editingBook["VITI I BOTIMIT"] || editingBook["Viti_I_Botimit"] || ''}
                              onChange={(e) => setEditingBook({...editingBook, "Viti i botimit": e.target.value})}
                              placeholder="Year"
                            />
                            <input
                              type="text"
                              value={editingBook["Nr faqe"] || editingBook["NR FAQE"] || editingBook["Nr_Faqe"] || ''}
                              onChange={(e) => setEditingBook({...editingBook, "Nr faqe": e.target.value})}
                              placeholder="Pages"
                            />
                            <input
                              type="text"
                              value={editingBook.Cmimi || editingBook.CMIMI || ''}
                              onChange={(e) => setEditingBook({...editingBook, Cmimi: e.target.value})}
                              placeholder="Price"
                            />
                          </div>
                          <div className="form-actions">
                            <button onClick={handleSaveEdit} className="save-btn">
                              <FontAwesomeIcon icon={faSave} /> Save
                            </button>
                            <button onClick={() => setEditingBook(null)} className="cancel-btn">
                              <FontAwesomeIcon icon={faTimes} /> Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        // View Mode
                        <div className="book-info">
                          <div className="book-details">
                            <h4>{book.Titulli || book.TITULLI || 'No Title'}</h4>
                            <p><strong>Author:</strong> {book.Autori || book.AUTORI || 'N/A'}</p>
                            <p><strong>Publisher:</strong> {book["Shtepia botuese"] || book["SHTEPIA BOTUESE"] || book["Shtepia_Botuese"] || 'N/A'}</p>
                            <p><strong>Year:</strong> {book["Viti i botimit"] || book["VITI I BOTIMIT"] || book["Viti_I_Botimit"] || 'N/A'}</p>
                            <p><strong>Pages:</strong> {book["Nr faqe"] || book["NR FAQE"] || book["Nr_Faqe"] || 'N/A'}</p>
                            <p><strong>Price:</strong> {book.Cmimi || book.CMIMI || 'N/A'}</p>
                          </div>
                          <div className="book-actions">
                            <button onClick={() => handleEditBook(book)} className="edit-btn">
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button onClick={() => handleDeleteBook(book)} className="delete-btn">
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Original floating button mode (not used anymore)
  if (showLogin) {
    return (
      <AdminLogin 
        onLogin={handleLogin} 
        onClose={() => setShowLogin(false)} 
      />
    );
  }

  if (!isVisible) {
    return null; // Hide the floating button completely
  }

  return (
    <div className="admin-overlay">
      <div className="admin-panel">
        <div className="admin-header">
          <div className="admin-title">
            <h2>Library Admin Panel</h2>
            <span className="user-info">Welcome, {currentUser}</span>
          </div>
          <div className="header-actions">
            <button 
              className="logout-btn"
              onClick={handleLogout}
              title="Logout"
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
            </button>
            <button 
              className="close-btn"
              onClick={() => setIsVisible(false)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>

        <div className="admin-content">
          {/* Category Management */}
          <div className="category-section">
            <h3>Categories</h3>
            <div className="category-controls">
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="category-select"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              
              <div className="add-category">
                <input
                  type="text"
                  placeholder="New category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="category-input"
                />
                <button onClick={handleAddCategory} className="add-btn">
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
            </div>
          </div>

          {/* Book Management */}
          {selectedCategory && (
            <div className="books-section">
              <div className="books-header">
                <h3>Books in {selectedCategory} ({currentBooks.length})</h3>
                <button 
                  onClick={() => setIsAddingNew(true)} 
                  className="add-book-btn"
                >
                  <FontAwesomeIcon icon={faPlus} /> Add Book
                </button>
              </div>

              {/* Add New Book Form */}
              {isAddingNew && (
                <div className="book-form">
                  <h4>Add New Book</h4>
                  <div className="form-grid">
                    <input
                      type="text"
                      placeholder="Title"
                      value={newBook.Titulli || ''}
                      onChange={(e) => setNewBook({...newBook, Titulli: e.target.value})}
                    />
                    <input
                      type="text"
                      placeholder="Author"
                      value={newBook.Autori || ''}
                      onChange={(e) => setNewBook({...newBook, Autori: e.target.value})}
                    />
                    <input
                      type="text"
                      placeholder="Publisher"
                      value={newBook["Shtepia botuese"] || ''}
                      onChange={(e) => setNewBook({...newBook, "Shtepia botuese": e.target.value})}
                    />
                    <input
                      type="text"
                      placeholder="Year"
                      value={newBook["Viti i botimit"] || ''}
                      onChange={(e) => setNewBook({...newBook, "Viti i botimit": e.target.value})}
                    />
                    <input
                      type="text"
                      placeholder="Pages"
                      value={newBook["Nr faqe"] || ''}
                      onChange={(e) => setNewBook({...newBook, "Nr faqe": e.target.value})}
                    />
                    <input
                      type="text"
                      placeholder="Price"
                      value={newBook.Cmimi || ''}
                      onChange={(e) => setNewBook({...newBook, Cmimi: e.target.value})}
                    />
                  </div>
                  <div className="form-actions">
                    <button onClick={handleAddBook} className="save-btn">
                      <FontAwesomeIcon icon={faSave} /> Save
                    </button>
                    <button onClick={() => setIsAddingNew(false)} className="cancel-btn">
                      <FontAwesomeIcon icon={faTimes} /> Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Books List */}
              <div className="books-list">
                {currentBooks.map((book, index) => (
                  <div key={index} className="book-item">
                    {editingBook && (editingBook["Nr."] || editingBook["NR."]) === (book["Nr."] || book["NR."]) ? (
                      // Edit Mode
                      <div className="book-form">
                        <div className="form-grid">
                          <input
                            type="text"
                            value={editingBook.Titulli || editingBook.TITULLI || ''}
                            onChange={(e) => setEditingBook({...editingBook, Titulli: e.target.value})}
                            placeholder="Title"
                          />
                          <input
                            type="text"
                            value={editingBook.Autori || editingBook.AUTORI || ''}
                            onChange={(e) => setEditingBook({...editingBook, Autori: e.target.value})}
                            placeholder="Author"
                          />
                          <input
                            type="text"
                            value={editingBook["Shtepia botuese"] || editingBook["SHTEPIA BOTUESE"] || editingBook["Shtepia_Botuese"] || ''}
                            onChange={(e) => setEditingBook({...editingBook, "Shtepia botuese": e.target.value})}
                            placeholder="Publisher"
                          />
                          <input
                            type="text"
                            value={editingBook["Viti i botimit"] || editingBook["VITI I BOTIMIT"] || editingBook["Viti_I_Botimit"] || ''}
                            onChange={(e) => setEditingBook({...editingBook, "Viti i botimit": e.target.value})}
                            placeholder="Year"
                          />
                          <input
                            type="text"
                            value={editingBook["Nr faqe"] || editingBook["NR FAQE"] || editingBook["Nr_Faqe"] || ''}
                            onChange={(e) => setEditingBook({...editingBook, "Nr faqe": e.target.value})}
                            placeholder="Pages"
                          />
                          <input
                            type="text"
                            value={editingBook.Cmimi || editingBook.CMIMI || ''}
                            onChange={(e) => setEditingBook({...editingBook, Cmimi: e.target.value})}
                            placeholder="Price"
                          />
                        </div>
                        <div className="form-actions">
                          <button onClick={handleSaveEdit} className="save-btn">
                            <FontAwesomeIcon icon={faSave} /> Save
                          </button>
                          <button onClick={() => setEditingBook(null)} className="cancel-btn">
                            <FontAwesomeIcon icon={faTimes} /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div className="book-info">
                        <div className="book-details">
                          <h4>{book.Titulli || book.TITULLI || 'No Title'}</h4>
                          <p><strong>Author:</strong> {book.Autori || book.AUTORI || 'N/A'}</p>
                          <p><strong>Publisher:</strong> {book["Shtepia botuese"] || book["SHTEPIA BOTUESE"] || book["Shtepia_Botuese"] || 'N/A'}</p>
                          <p><strong>Year:</strong> {book["Viti i botimit"] || book["VITI I BOTIMIT"] || book["Viti_I_Botimit"] || 'N/A'}</p>
                          <p><strong>Pages:</strong> {book["Nr faqe"] || book["NR FAQE"] || book["Nr_Faqe"] || 'N/A'}</p>
                          <p><strong>Price:</strong> {book.Cmimi || book.CMIMI || 'N/A'}</p>
                        </div>
                        <div className="book-actions">
                          <button onClick={() => handleEditBook(book)} className="edit-btn">
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button onClick={() => handleDeleteBook(book)} className="delete-btn">
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;