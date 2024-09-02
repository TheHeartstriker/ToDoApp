import { useState, useContext, useEffect } from "react";
import { TaskContext } from "./TaskProvider";

function Groups() {
  const [ShowFolderCreate, setShowFolderCreate] = useState(true);
  const [folderMainName, setFolderMainName] = useState("");
  const [folders, setFolders] = useState([]);
  const { foldername, setFoldername } = useContext(TaskContext);
  const { isSignedIn, setIsSignedIn } = useContext(TaskContext);

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
  //On of to show the folder creator
  function ShowFolder() {
    setShowFolderCreate(!ShowFolderCreate);
  }
  //Delete a folder based on index
  function deleteFolder(index) {
    setFolders(folders.filter((folder) => folder.index !== index));
  }
  //Set the current folder name
  function CurrentFolder() {
    folders.map((folder) => {
      if (folder.folderOn) {
        setFoldername(folder.folderName);
      }
    });
  }
  //Used to change the folderOn value
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

  async function GetFolders() {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await fetch("/api/getFolders", options);
      const data = await response.json();

      const folderData = data.map((folder, index) => {
        return { folderName: folder.Folder, folderOn: false, index: index };
      });
      setFolders(folderData);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function sendCurrentFolder(folderName) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ folder: folderName }),
    };
    try {
      const response = await fetch("/api/setFolder", options);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    console.log(folders);
    if (isSignedIn) {
      GetFolders();
    }
  }, []);

  useEffect(() => {
    CurrentFolder();
    if (isSignedIn) {
      console.log(foldername);
      sendCurrentFolder(foldername);
    }
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
