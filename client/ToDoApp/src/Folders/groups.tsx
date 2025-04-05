import { useState, useContext, useEffect } from "react";
import { TaskContext, Contexts } from "../TaskProvider";
import { folderStruct } from "../Provider";

function Groups() {
  //Local state for the folder creator screen and the folders indvidual name
  const [ShowFolderCreate, setShowFolderCreate] = useState<boolean>(true);
  const [folderMainName, setFolderMainName] = useState<string>("");
  //Context values
  const { folders, setFolders } = useContext(TaskContext) as Contexts;
  const { foldername, setFoldername } = useContext(TaskContext) as Contexts;
  const { isSignedIn, setIsSignedIn } = useContext(TaskContext) as Contexts;

  const handleFolderNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFolderMainName(event.target.value);
  };

  //Add a folder to the local object with realted mete data
  function addFolder(folderName: string) {
    const newFolder: folderStruct = {
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
  function deleteFolder(index: number) {
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
    //If we have not found a folder then set the foldername to nothing
    if (!folderFound) {
      setFoldername("");
    }
  }
  //Used to change the folderOn value using the index
  function TrueFalseFolder(index: number) {
    const newFolders = folders.map((folder) => {
      if (folder.index === index) {
        return {
          ...folder,
          folderOn: !folder.folderOn,
        };
      } else {
        return {
          ...folder,
          folderOn: false,
        };
      }
    });
    setFolders(newFolders);
  }
  //Gets the folders related to the user and converts them to the correct format
  //Something to note this does not get the default "" folder
  async function GetFolders(): Promise<void> {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include" as RequestCredentials,
    };
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/getFolders`,
        options
      );
      if (!response.ok) {
        throw new Error("Network response was not ok" + response.status);
      }
      const data: { Folder: string }[] = await response.json();
      // Merge the fetched data with the existing folders state
      const folderData: folderStruct[] = data.map((folder, index: number) => {
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

  //Delete a folder from the database
  async function deleteFolderFromDB(FolderName: string) {
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include" as RequestCredentials,
      body: JSON.stringify({ FolderName }),
    };
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/deleteFolder`,
        options
      );
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    if (isSignedIn) {
      //This get excludes the default "" folder
      GetFolders();
    }
  }, [isSignedIn]);
  //Re checks the folder values and sees if the foldername needs to be updated
  useEffect(() => {
    CurrentFolder();
  }, [folders]);

  return (
    <>
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
            onClick={() => {
              deleteFolder(folder.index);
              deleteFolderFromDB(folder.folderName);
            }}
          >
            Delete
          </button>
        </div>
      ))}
      {ShowFolderCreate && (
        <div className="FolderCreate">
          <input
            type="text"
            className="HeaderTask"
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
      {!ShowFolderCreate && (
        <button className="ShowFolderCreate" onClick={() => ShowFolder()}>
          View Creator
        </button>
      )}
    </>
  );
}

export default Groups;
