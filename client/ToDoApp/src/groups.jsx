import { useState, useContext, useEffect } from "react";
import { TaskContext } from "./TaskProvider";

function Groups() {
  const [ShowFolderCreate, setShowFolderCreate] = useState(true);
  const [folderMainName, setFolderMainName] = useState("");
  const [folders, setFolders] = useState([]);
  const { foldername, setFoldername } = useContext(TaskContext);

  const handleFolderNameChange = (event) => {
    setFolderMainName(event.target.value);
  };

  function addFolder(folderName) {
    const newFolder = {
      folderName: folderName,
      folderOn: false,
      index: folders.length,
    };
    setFolders((prevFolders) => [...prevFolders, newFolder]);
  }

  function ShowFolder() {
    setShowFolderCreate(!ShowFolderCreate);
  }

  function deleteFolder(index) {
    setFolders(folders.filter((folder) => folder.index !== index));
  }

  function CurrentFolder() {
    folders.map((folder) => {
      if (folder.folderOn) {
        setFoldername(folder.folderName);
      }
    });
  }

  function TrueFalseFolder(index) {
    const newFolders = folders.map((folder) => {
      if (folder.index === index) {
        return {
          ...folder,
          folderOn: !folder.folderOn,
        };
      }
      return folder;
    });
    setFolders(newFolders);
  }

  useEffect(() => {
    CurrentFolder();
    console.log("Folders", folders);
    console.log("FolderName", foldername);
  }, [folders]);

  return (
    <>
      <div className="FolderContainer">
        {folders.map((folder, index) => (
          <div className="Folder" key={folder.folderName}>
            <button
              className={`FolderName ${folder.folderOn ? "FolderNameOn" : ""}`}
              onClick={() => TrueFalseFolder(folder.index)}
            >
              {folder.folderName}
            </button>
            <button
              className="FolderDelete"
              onClick={() => deleteFolder(folder.index)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      {ShowFolderCreate && (
        <div className="FolderCreate">
          <input
            type="text"
            id="HeaderTask"
            placeholder="FolderName"
            value={folderMainName}
            onChange={handleFolderNameChange}
          />
          <button id="AddFolder" onClick={() => addFolder(folderMainName)}>
            Create
          </button>
          <button id="Clear" onClick={() => ShowFolder()}>
            Clear
          </button>
        </div>
      )}
      <button id="ShowFolder" onClick={() => ShowFolder()}></button>
    </>
  );
}

export default Groups;
