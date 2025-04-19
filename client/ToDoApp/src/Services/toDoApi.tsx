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

export async function sendTaskData(datatosend: taskStuct): Promise<void> {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include" as RequestCredentials,
    body: JSON.stringify(datatosend),
  };
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/createToDo`,
      options
    );
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error:", errorData.message);
      return;
    }
    const responseData = await response.json();
    console.log("Response from server:", responseData.message);
    if (responseData.success) {
      console.log(responseData.success, responseData.message || "No message");
      return responseData;
    } else {
      console.error(
        "Login failed:",
        responseData.message || "No message",
        responseData.success || "No success message"
      );
      return;
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function loadTaskData(foldername: string) {
  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include" as RequestCredentials,
  };
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/api/getTododata?foldername=${encodeURIComponent(foldername)}`,
      options
    );
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error:", errorData.message);
      return;
    }
    const data = await response.json();
    if (data.success) {
      console.log("Response from server:", data.tasks, data.message);
      return data;
    } else {
      console.error(
        "Login failed:",
        data.message || "No message",
        data.success || "No success message"
      );
      return;
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function deleteTask(task_id: string) {
  const options: RequestInit = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include" as RequestCredentials,
    body: JSON.stringify({ Task: task_id }),
  };
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/deleteToDo`,
      options
    );
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error:", errorData.message);
      return;
    }
    const data = await response.json();
    if (data.success) {
      console.log("Response from server:", data.message, data.success);
      return data;
    } else {
      console.error(
        "Login failed:",
        data.message || "No message",
        data.success || "No success message"
      );
      return;
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

export async function updateTaskComplete(task_id: string) {
  const options: RequestInit = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include" as RequestCredentials,
    body: JSON.stringify({ task_id }),
  };
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/updateToDo`,
      options
    );
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error:", errorData.message);
      return;
    }
    const data = await response.json();
    if (data.success) {
      console.log("Response from server:", data.message, data.success);
    } else {
      console.error(
        "Login failed:",
        data.message || "No message",
        data.success || "No success message"
      );
      return;
    }
  } catch (error) {
    console.error("Error:", error);
  }
}
