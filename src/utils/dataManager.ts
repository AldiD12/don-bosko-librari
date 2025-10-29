// Data management utilities for syncing library data
import libraryDataImport from '../assets/librat.json';

export interface Book {
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

export type LibraryData = { [key: string]: Book[] };

const STORAGE_KEY = 'donBosko_library_data';
const LAST_UPDATE_KEY = 'donBosko_library_lastUpdate';

// Get the current library data (either from localStorage or original JSON)
export const getLibraryData = (): LibraryData => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      const parsed = JSON.parse(storedData);
      // Validate that it's a valid library data structure
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn('Error loading stored library data:', error);
  }
  
  // Return original data if no stored data or error
  return libraryDataImport as LibraryData;
};

// Save library data to localStorage
export const saveLibraryData = (data: LibraryData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(LAST_UPDATE_KEY, Date.now().toString());
    
    // Dispatch a custom event to notify other components
    window.dispatchEvent(new CustomEvent('libraryDataUpdated', { 
      detail: { data, timestamp: Date.now() } 
    }));
  } catch (error) {
    console.error('Error saving library data:', error);
  }
};

// Get the last update timestamp
export const getLastUpdateTime = (): number => {
  try {
    const timestamp = localStorage.getItem(LAST_UPDATE_KEY);
    return timestamp ? parseInt(timestamp, 10) : 0;
  } catch (error) {
    return 0;
  }
};

// Reset to original data (useful for testing or reset functionality)
export const resetLibraryData = (): LibraryData => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LAST_UPDATE_KEY);
    
    const originalData = libraryDataImport as LibraryData;
    window.dispatchEvent(new CustomEvent('libraryDataUpdated', { 
      detail: { data: originalData, timestamp: Date.now() } 
    }));
    
    return originalData;
  } catch (error) {
    console.error('Error resetting library data:', error);
    return libraryDataImport as LibraryData;
  }
};

// Check if there are any stored changes
export const hasStoredChanges = (): boolean => {
  return localStorage.getItem(STORAGE_KEY) !== null;
};