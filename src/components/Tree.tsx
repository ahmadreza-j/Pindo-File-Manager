import { type FC, useState } from "react";
import { useFS } from "../state/fsContext";
import { NodeRow } from "./NodeRow";
import { DialogCreateFolder } from "./DialogCreateFolder";
import { DialogCreateFile } from "./DialogCreateFile";
import { DialogRenameFile } from "./DialogRenameFile";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";

export const Tree: FC = () => {
  const { state } = useFS();
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showCreateFile, setShowCreateFile] = useState(false);
  const [showRenameFile, setShowRenameFile] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedParentId, setSelectedParentId] = useState<string>("");
  const [selectedFileId, setSelectedFileId] = useState<string>("");
  const [selectedNodeId, setSelectedNodeId] = useState<string>("");

  const rootNode = state.nodes[state.rootId];

  if (!rootNode) {
    return <div>No root node found</div>;
  }

  const handleAddFolder = (parentId: string) => {
    setSelectedParentId(parentId);
    setShowCreateFolder(true);
  };

  const handleAddFile = (parentId: string) => {
    setSelectedParentId(parentId);
    setShowCreateFile(true);
  };

  const handleRenameFile = (fileId: string) => {
    setSelectedFileId(fileId);
    setShowRenameFile(true);
  };

  const handleDeleteNode = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    setShowDeleteConfirm(true);
  };

  return (
    <div className="tree">
      <NodeRow
        node={rootNode}
        depth={0}
        onAddFolder={handleAddFolder}
        onAddFile={handleAddFile}
        onRenameFile={handleRenameFile}
        onDeleteNode={handleDeleteNode}
      />

      {showCreateFolder && (
        <DialogCreateFolder
          parentId={selectedParentId}
          onClose={() => setShowCreateFolder(false)}
        />
      )}

      {showCreateFile && (
        <DialogCreateFile
          parentId={selectedParentId}
          onClose={() => setShowCreateFile(false)}
        />
      )}

      {showRenameFile && (
        <DialogRenameFile
          fileId={selectedFileId}
          onClose={() => setShowRenameFile(false)}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmDeleteDialog
          nodeId={selectedNodeId}
          onClose={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
};
