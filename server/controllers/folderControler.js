import ToDo from "../models/ToDoModel.js";
import { Op } from "sequelize";
import { validateData } from "../utils/dataValidation.js";
async function getFolders(req, res, next) {
  try {
    const userId = req.user.id;
    //Find all realted folders
    const folders = await ToDo.findAll({
      where: {
        folder: { [Op.ne]: "" },
        userId: userId,
      },
      attributes: ["folder"],
      group: ["folder"],
    });
    //Check if folders exist
    if (!folders || folders.length === 0) {
      return res
        .status(404)
        .json({ message: "No folders found", success: false });
    }

    res.status(200).json({ folders, success: true });
  } catch (error) {
    next(error);
  }
}

async function deleteFolder(req, res, next) {
  try {
    const { FolderName } = req.body;
    const userId = req.user.id;
    const validate = [{ FolderName: FolderName }];
    validateData(validate, [["FolderName", "string", 249]]);
    //Delete folder
    const folder = await ToDo.destroy({
      where: {
        folder: FolderName,
        userId: userId,
      },
    });
    //Check if folder exists
    if (!folder || folder.length === 0) {
      return res
        .status(404)
        .json({ message: "Folder not found", success: false });
    }
    res.status(200).json({ message: "Folder deleted", success: true });
  } catch (error) {
    next(error);
  }
}

export { getFolders, deleteFolder };
