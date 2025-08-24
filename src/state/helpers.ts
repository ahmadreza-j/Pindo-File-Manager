import { FSState, FolderNode, FileNode } from './fsTypes';

export const createInitialState = (): FSState => {
  const rootId = crypto.randomUUID();
  const documentsId = crypto.randomUUID();
  const projectsId = crypto.randomUUID();
  const workId = crypto.randomUUID();
  const notesId = crypto.randomUUID();
  const reportId = crypto.randomUUID();
  const appId = crypto.randomUUID();

  const nodes = {
    [rootId]: {
      id: rootId,
      parentId: null,
      type: 'folder' as const,
      name: 'Root',
      children: [documentsId, projectsId]
    },
    [documentsId]: {
      id: documentsId,
      parentId: rootId,
      type: 'folder' as const,
      name: 'Documents',
      children: [notesId, workId]
    },
    [projectsId]: {
      id: projectsId,
      parentId: rootId,
      type: 'folder' as const,
      name: 'Projects',
      children: [appId]
    },
    [workId]: {
      id: workId,
      parentId: documentsId,
      type: 'folder' as const,
      name: 'Work',
      children: [reportId]
    },
    [notesId]: {
      id: notesId,
      parentId: documentsId,
      type: 'file' as const,
      name: 'notes',
      ext: 'txt'
    },
    [reportId]: {
      id: reportId,
      parentId: workId,
      type: 'file' as const,
      name: 'report',
      ext: 'pdf'
    },
    [appId]: {
      id: appId,
      parentId: projectsId,
      type: 'file' as const,
      name: 'app',
      ext: 'js'
    }
  };

  return {
    nodes,
    rootId
  };
};

export const deleteNodeRecursive = (state: FSState, nodeId: string): FSState => {
  const node = state.nodes[nodeId];
  if (!node) return state;

  const newNodes = { ...state.nodes };

  if (node.type === 'folder') {
    // Recursively delete all children
    node.children.forEach(childId => {
      const childResult = deleteNodeRecursive({ nodes: newNodes, rootId: state.rootId }, childId);
      Object.assign(newNodes, childResult.nodes);
    });
  }

  // Remove from parent's children array
  if (node.parentId) {
    const parent = newNodes[node.parentId] as FolderNode;
    if (parent && parent.type === 'folder') {
      parent.children = parent.children.filter(id => id !== nodeId);
    }
  }

  // Remove the node itself
  delete newNodes[nodeId];

  return {
    ...state,
    nodes: newNodes
  };
};

export const addNodeToParent = (state: FSState, parentId: string, nodeId: string): FSState => {
  const parent = state.nodes[parentId];
  if (!parent || parent.type !== 'folder') return state;

  const newNodes = { ...state.nodes };
  const newParent = { ...parent };
  newParent.children = [...parent.children, nodeId];
  newNodes[parentId] = newParent;

  return {
    ...state,
    nodes: newNodes
  };
};