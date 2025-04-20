import { taskStuct } from "../Types/Provider";
import { errorChecker } from "../utils/errorApi";

export async function getFolders() {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/getFolders`,
      {
        signal: controller.signal,
        credentials: "include" as RequestCredentials,
      }
    );
    clearTimeout(timeoutId);
    return await errorChecker(response);
  } catch (error) {
    clearTimeout(timeoutId);
    return error;
  }
}

export async function deleteFolder(FolderName: string) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/deleteFolder`,
      {
        signal: controller.signal,
        credentials: "include" as RequestCredentials,
        method: "DELETE",
        body: JSON.stringify({ FolderName }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    clearTimeout(timeoutId);
    return await errorChecker(response);
  } catch (error) {
    clearTimeout(timeoutId);
    return error;
  }
}

export async function sendTaskData(datatosend: taskStuct) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/createToDo`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datatosend),
        credentials: "include" as RequestCredentials,
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);
    return await errorChecker(response);
  } catch (error) {
    clearTimeout(timeoutId);
    return error;
  }
}

export async function loadTaskData(foldername: string) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/api/getTododata?foldername=${encodeURIComponent(foldername)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include" as RequestCredentials,
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);
    return await errorChecker(response);
  } catch (error) {
    clearTimeout(timeoutId);
    return error;
  }
}

export async function deleteTask(task_id: string) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/deleteToDo`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task_id }),
        credentials: "include" as RequestCredentials,
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);
    return await errorChecker(response);
  } catch (error) {
    clearTimeout(timeoutId);
    return error;
  }
}

export async function updateTaskComplete(task_id: string) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/updateToDo`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task_id }),
        credentials: "include" as RequestCredentials,
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);
    return await errorChecker(response);
  } catch (error) {
    clearTimeout(timeoutId);
    return error;
  }
}
