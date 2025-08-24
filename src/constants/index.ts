export const STORAGE_KEYS = {
  FILE_SYSTEM: "fs",
} as const;

export const TOAST_DURATION = 4000;

export const FORBIDDEN_CHARS_REGEX = /[/\\:*?"<>|]/;

export const FORBIDDEN_CHARS_LIST = ['/', '\\', ':', '*', '?', '"', '<', '>', '|'] as const;

export const TREE_INDENTATION = 20; // pixels per depth level

export const NODE_TYPES = {
  FILE: "file",
  FOLDER: "folder",
} as const;

export const VALIDATION_ERROR_TYPES = {
  EMPTY: "empty",
  INVALID: "invalid", 
  DUPLICATE: "duplicate",
} as const;

export const TOAST_TYPES = {
  SUCCESS: "success",
  ERROR: "error",
} as const;