// Production data manager with GitHub integration
import { LibraryData, Book } from './dataManager';

const GITHUB_API_BASE = 'https://api.github.com';
const REPO_OWNER = process.env.REACT_APP_GITHUB_OWNER || 'AldiD12';
const REPO_NAME = process.env.REACT_APP_GITHUB_REPO || 'don-bosko-librari';
const FILE_PATH = 'src/assets/librat.json';
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

interface GitHubFileResponse {
  content: string;
  sha: string;
  encoding: string;
}

// Get current file content and SHA from GitHub
const getGitHubFile = async (): Promise<{ content: LibraryData; sha: string } | null> => {
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data: GitHubFileResponse = await response.json();
    const content = JSON.parse(atob(data.content));
    
    return { content, sha: data.sha };
  } catch (error) {
    console.error('Error fetching from GitHub:', error);
    return null;
  }
};

// Update file on GitHub
const updateGitHubFile = async (newData: LibraryData, sha: string): Promise<boolean> => {
  try {
    const content = btoa(JSON.stringify(newData, null, 2));
    
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Update library data - ${new Date().toISOString()}`,
          content,
          sha,
          committer: {
            name: 'Don Bosko Library Admin',
            email: 'admin@donbosko-library.com'
          }
        }),
      }
    );

    return response.ok;
  } catch (error) {
    console.error('Error updating GitHub file:', error);
    return false;
  }
};

// Production save function
export const saveLibraryDataProduction = async (newData: LibraryData): Promise<boolean> => {
  if (!GITHUB_TOKEN) {
    console.warn('No GitHub token provided, falling back to localStorage');
    // Fallback to localStorage for development
    localStorage.setItem('donBosko_library_data', JSON.stringify(newData));
    window.dispatchEvent(new CustomEvent('libraryDataUpdated', { 
      detail: { data: newData, timestamp: Date.now() } 
    }));
    return true;
  }

  try {
    // Get current file SHA
    const fileData = await getGitHubFile();
    if (!fileData) {
      throw new Error('Could not fetch current file data');
    }

    // Update the file
    const success = await updateGitHubFile(newData, fileData.sha);
    
    if (success) {
      // Also update localStorage for immediate UI updates
      localStorage.setItem('donBosko_library_data', JSON.stringify(newData));
      window.dispatchEvent(new CustomEvent('libraryDataUpdated', { 
        detail: { data: newData, timestamp: Date.now() } 
      }));
      
      // Show success message
      window.dispatchEvent(new CustomEvent('showNotification', {
        detail: { 
          message: 'Changes saved successfully! Website will update in 1-2 minutes.', 
          type: 'success' 
        }
      }));
    }
    
    return success;
  } catch (error) {
    console.error('Error saving to production:', error);
    
    // Show error message
    window.dispatchEvent(new CustomEvent('showNotification', {
      detail: { 
        message: 'Error saving changes. Please try again.', 
        type: 'error' 
      }
    }));
    
    return false;
  }
};

// Check if we're in production mode
export const isProductionMode = (): boolean => {
  return !!GITHUB_TOKEN && process.env.NODE_ENV === 'production';
};

// Get deployment status
export const getDeploymentStatus = async (): Promise<string> => {
  if (!isProductionMode()) return 'development';
  
  try {
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${REPO_OWNER}/${REPO_NAME}/deployments`,
      {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );
    
    if (response.ok) {
      const deployments = await response.json();
      return deployments.length > 0 ? deployments[0].environment : 'unknown';
    }
  } catch (error) {
    console.error('Error checking deployment status:', error);
  }
  
  return 'unknown';
};