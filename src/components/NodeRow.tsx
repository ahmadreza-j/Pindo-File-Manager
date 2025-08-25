import { type FC, useState, memo } from "react";
import { FSNode } from "../state/fsTypes";
import { useFS } from "../state/fsContext";
import { TREE_INDENTATION } from "../constants";

interface NodeRowProps {
  node: FSNode;
  depth: number;
  onAddFolder: (parentId: string) => void;
  onAddFile: (parentId: string) => void;
  onRenameFile: (fileId: string) => void;
  onRenameFolder: (folderId: string) => void;
  onDeleteNode: (nodeId: string) => void;
}

const NodeRowComponent: FC<NodeRowProps> = ({
  node,
  depth,
  onAddFolder,
  onAddFile,
  onRenameFile,
  onRenameFolder,
  onDeleteNode,
}) => {
  const { state } = useFS();
  const isRoot = node.id === state.rootId;
  const [isExpanded, setIsExpanded] = useState(true);

  const handleToggleExpanded = () => {
    if (node.type === "folder") {
      setIsExpanded(!isExpanded);
    }
  };

  const getIcon = () => {
    if (node.type === "folder") {
      return isExpanded ? "📂" : "📁";
    }
    return "📄";
  };

  const getName = () => {
    if (node.type === "file") {
      return `${node.name}.${node.ext}`;
    }
    return node.name;
  };

  const renderActions = () => {
    if (node.type === "folder") {
      return (
        <div className="actions">
          <button
            onClick={() => onAddFile(node.id)}
            title="Add File"
            className="action-btn"
          >
            📄
          </button>
          <button
            onClick={() => onAddFolder(node.id)}
            title="Add Folder"
            className="action-btn"
          >
            📂
          </button>
          {!isRoot && (
            <>
              <button
                onClick={() => onRenameFolder(node.id)}
                title="Rename"
                className="action-btn"
              >
                ✎
              </button>
              <button
                onClick={() => onDeleteNode(node.id)}
                title="Delete"
                className="action-btn delete"
              >
                ❌
              </button>
            </>
          )}
        </div>
      );
    } else {
      return (
        <div className="actions">
          <button
            onClick={() => onRenameFile(node.id)}
            title="Rename"
            className="action-btn"
          >
            ✎
          </button>
          <button
            onClick={() => onDeleteNode(node.id)}
            title="Delete"
            className="action-btn delete"
          >
            ❌
          </button>
        </div>
      );
    }
  };

  const renderChildren = () => {
    if (node.type === "folder" && isExpanded && node.children.length > 0) {
      return (
        <div className="children">
          {node.children.map((childId) => {
            const child = state.nodes[childId];
            if (!child) return null;

            return (
              <NodeRow
                key={child.id}
                node={child}
                depth={depth + 1}
                onAddFolder={onAddFolder}
                onAddFile={onAddFile}
                onRenameFile={onRenameFile}
                onRenameFolder={onRenameFolder}
                onDeleteNode={onDeleteNode}
              />
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="node-row">
      <div className="node-content" style={{ paddingLeft: `${depth * TREE_INDENTATION}px` }}>
        <span
          className="node-toggle"
          onClick={handleToggleExpanded}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleToggleExpanded();
            }
          }}
          tabIndex={node.type === "folder" ? 0 : -1}
          role={node.type === "folder" ? "button" : undefined}
          aria-expanded={node.type === "folder" ? isExpanded : undefined}
          aria-label={
            node.type === "folder"
              ? `${isExpanded ? "Collapse" : "Expand"} ${node.name} folder`
              : undefined
          }
          style={{
            cursor: node.type === "folder" ? "pointer" : "default",
            opacity: node.type === "folder" ? 1 : 0.5,
          }}
        >
          {getIcon()}
        </span>
        <span className="node-name">{getName()}</span>
        {renderActions()}
      </div>
      {renderChildren()}
    </div>
  );
};

export const NodeRow = memo(NodeRowComponent);
