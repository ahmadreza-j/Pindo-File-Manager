import { FSState, FSNode, ValidationError } from './fsTypes';

const FORBIDDEN_CHARS = /[/\\:*?"<>|]/;

export const validateName = (name: string): ValidationError | null => {
  const trimmed = name.trim();
  
  if (!trimmed) {
    return { type: 'empty', message: 'Name cannot be empty' };
  }
  
  if (FORBIDDEN_CHARS.test(trimmed)) {
    return { type: 'invalid', message: 'Contains forbidden characters' };
  }
  
  return null;
};

export const validateExtension = (ext: string): ValidationError | null => {
  const trimmed = ext.trim();
  
  if (!trimmed) {
    return { type: 'empty', message: 'Extension cannot be empty' };
  }
  
  if (FORBIDDEN_CHARS.test(trimmed)) {
    return { type: 'invalid', message: 'Contains forbidden characters' };
  }
  
  return null;
};

export const checkFolderNameUnique = (
  state: FSState,
  parentId: string,
  name: string,
  excludeId?: string
): ValidationError | null => {
  const trimmed = name.trim().toLowerCase();
  const parent = state.nodes[parentId] as any;
  
  if (!parent || parent.type !== 'folder') return null;
  
  const siblings = parent.children
    .map(id => state.nodes[id])
    .filter(node => node && node.type === 'folder' && node.id !== excludeId);
  
  const duplicate = siblings.find(sibling => 
    sibling.name.trim().toLowerCase() === trimmed
  );
  
  if (duplicate) {
    return { type: 'duplicate', message: 'Name already exists' };
  }
  
  return null;
};

export const checkFileNameUnique = (
  state: FSState,
  parentId: string,
  name: string,
  ext: string,
  excludeId?: string
): ValidationError | null => {
  const trimmedName = name.trim().toLowerCase();
  const trimmedExt = ext.trim().toLowerCase();
  const parent = state.nodes[parentId] as any;
  
  if (!parent || parent.type !== 'folder') return null;
  
  const siblings = parent.children
    .map(id => state.nodes[id])
    .filter(node => node && node.type === 'file' && node.id !== excludeId) as any[];
  
  const duplicate = siblings.find(sibling => 
    sibling.name.trim().toLowerCase() === trimmedName &&
    sibling.ext.trim().toLowerCase() === trimmedExt
  );
  
  if (duplicate) {
    return { type: 'duplicate', message: `${name.trim()}.${ext.trim()} already exists` };
  }
  
  return null;
};

export const validateFolderCreation = (
  state: FSState,
  parentId: string,
  name: string
): ValidationError | null => {
  const nameError = validateName(name);
  if (nameError) return nameError;
  
  return checkFolderNameUnique(state, parentId, name);
};

export const validateFileCreation = (
  state: FSState,
  parentId: string,
  name: string,
  ext: string
): ValidationError | null => {
  const nameError = validateName(name);
  if (nameError) return nameError;
  
  const extError = validateExtension(ext);
  if (extError) return extError;
  
  return checkFileNameUnique(state, parentId, name, ext);
};

export const validateFileRename = (
  state: FSState,
  fileId: string,
  newName: string,
  newExt: string
): ValidationError | null => {
  const file = state.nodes[fileId];
  if (!file || file.type !== 'file') return null;
  
  const nameError = validateName(newName);
  if (nameError) return nameError;
  
  const extError = validateExtension(newExt);
  if (extError) return extError;
  
  return checkFileNameUnique(state, file.parentId!, newName, newExt, fileId);
};