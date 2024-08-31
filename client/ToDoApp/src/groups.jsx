import { useState, useContext, useEffect } from "react";
import { TaskContext } from "./TaskProvider";

function Groups() {
  const [folders, setFolders] = useState([]);
  const { userId, setUserId } = useContext(TaskContext);
  const [folderMainName, setFolderMainName] = useState("");

  const handleFolderNameChange = (event) => {
    setFolderMainName(event.target.value);
  };

  const addFolder = (folderName) => {
    console.log("Adding folder:", folderName);
    const newFolder = {
      folderName: folderName,
      folderOn: false,
      index: folders.length,
    };
    setFolders((prevFolders) => [...prevFolders, newFolder]);
  };

  const handleFolderClick = (index) => {
    setFolders((prevFolders) =>
      prevFolders.map((folder, i) =>
        i === index ? { ...folder, folderOn: !folder.folderOn } : folder
      )
    );
  };

  return (
    <>
      <div className="FolderContainer">
        {folders.map((folder, index) => (
          <div className="Folder" key={folder.folderName}>
            <button
              className="FolderButton"
              onClick={() => handleFolderClick(index)}
            >
              {folder.folderName}
            </button>
          </div>
        ))}
      </div>

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
        <button id="Clear">Clear</button>
      </div>
    </>
  );
}

export default Groups;
