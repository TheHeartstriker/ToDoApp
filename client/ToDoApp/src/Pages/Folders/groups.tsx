import { useState, useContext, useEffect, useRef } from "react";
import { TaskContext, Contexts } from "../../components/taskProvider";
import { folderStruct } from "../../types/Provider";
import { getFolders, deleteFolder } from "../../services/toDoApi";
import "./check-Folder.css";

function Groups() {
  //Local state for the folder creator screen and the folders indvidual name
  const [ShowFolderCreate, setShowFolderCreate] = useState<boolean>(true);
  const [folderMainName, setFolderMainName] = useState<string>("");
  //Context values
  const [folders, setFolders] = useState<folderStruct[]>([]);
  const { foldername, setFoldername } = useContext(TaskContext) as Contexts;

  //Add a folder to local
  function addFolder(folderName: string) {
    const newFolder: folderStruct = {
      folder: folderName,
      folderOn: false,
      index: folders.length,
    };
    setFolders((prevFolders) => [...prevFolders, newFolder]);
  }

  //Delete a folder based on index and set to "" if deleted folder is the current one
  function deleteFolderLocal(index: number) {
    const folderToDelete = folders.find((folder) => folder.index === index);
    if (folderToDelete && folderToDelete.folder === foldername) {
      setFoldername("");
    }
    setFolders(folders.filter((folder) => folder.index !== index));
  }

  async function awaitFolders() {
    try {
      const data = await getFolders();
      if (data.folders) {
        setFolders(data.folders);
      }
    } catch (error) {
      console.error("Error fetching folders:", error);
    }
  }

  useEffect(() => {
    awaitFolders();
  }, []);

  return (
    <>
      {folders.length > 0 &&
        folders.map((folder, index) => (
          <div className="Folder" key={folder.folder}>
            <button
              className={`FolderName ${
                folder.folder === foldername ? "FolderNameOn" : ""
              }`}
              onClick={() => setFoldername(folder.folder)}
              onDoubleClick={() => setFoldername("")}
            >
              {folder.folder}
            </button>
            <button
              className="FolderDelete"
              onClick={() => {
                deleteFolderLocal(folder.index);
                deleteFolder(folder.folder);
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
            onChange={(e) => setFolderMainName(e.target.value)}
          />
          <button
            className="action_btn"
            onClick={() => addFolder(folderMainName)}
          >
            Create
          </button>
          <button
            className="action_btn"
            onClick={() => setShowFolderCreate(!ShowFolderCreate)}
          >
            Clear
          </button>
        </div>
      )}
      {!ShowFolderCreate && (
        <button
          className="ShowFolderCreate"
          onClick={() => setShowFolderCreate(!ShowFolderCreate)}
        >
          View Creator
        </button>
      )}
    </>
  );
}

export default Groups;
