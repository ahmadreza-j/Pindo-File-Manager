import { FSState } from './fsTypes';
import { createInitialState } from './helpers';

const FS_STORAGE_KEY = 'fs';

export const saveToStorage = (state: FSState): void => {
  try {
    localStorage.setItem(FS_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

export const loadFromStorage = (): FSState | null => {
  try {
    const stored = localStorage.getItem(FS_STORAGE_KEY);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    
    // Validate the stored data has the expected structure
    if (!parsed.nodes || !parsed.rootId || !parsed.nodes[parsed.rootId]) {
      return null;
    }
    
    return parsed;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return null;
  }
};

export const getInitialFSState = (): FSState => {
  const stored = loadFromStorage();
  return stored || createInitialState();
};