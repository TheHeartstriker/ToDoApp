import { useState, useContext, useEffect } from "react";
import { TaskContext } from "./TaskProvider";

function Groups() {
  const [ShowFolderCreate, setShowFolderCreate] = useState(true);
  const [folderMainName, setFolderMainName] = useState("");
  const { folders, setFolders } = useContext(TaskContext);
  const { foldername, setFoldername } = useContext(TaskContext);
  const { isSignedIn, setIsSignedIn } = useContext(TaskContext);
  //Highlight and loading issues

  const handleFolderNameChange = (event) => {
    setFolderMainName(event.target.value);
  };

  //Add a folder to the object with realted mete data
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
  //If we have been clicked then name of the folder to the overhead
  function CurrentFolder() {
    let folderFound = false;
    folders.forEach((folder) => {
      if (folder.folderOn) {
        setFoldername(folder.folderName);
        folderFound = true;
      }
    });
    if (!folderFound) {
      setFoldername("");
    }
  }
  //Used to change the folderOn value
  function TrueFalseFolder(index) {
    const newFolders = folders.map((folder) => {
      if (folder.index === index) {
        return {
          ...folder,
          folderOn: !folder.folderOn, // Toggle the clicked folder
        };
      } else {
        return {
          ...folder,
          folderOn: false, // Set all other folders to false
        };
      }
    });
    setFolders(newFolders);
  }
  //Get the folder acosiated with the user
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
      // Merge the fetched data with the existing folders state
      const folderData = data.map((folder, index) => {
        const existingFolder = folders.find(
          (f) => f.folderName === folder.Folder
        );
        return {
          folderName: folder.Folder,
          folderOn: existingFolder ? existingFolder.folderOn : false,
          index: index,
        };
      });
      setFolders(folderData);
    } catch (error) {
      console.error("Error:", error);
    }
  }
  //Give the server the current folder so it can be used in the container to load the data
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
    console.log(foldername);
    if (isSignedIn) {
      GetFolders();
    }
  }, [isSignedIn]);
  //Re checks the folder values and sets the foldername
  useEffect(() => {
    CurrentFolder();
  }, [folders]);
  //Send the current folder to the server
  useEffect(() => {
    sendCurrentFolder(foldername);
  }, [foldername]);

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
