import { taskStuct } from "../Types/Provider";

export async function GetFolders() {
  const options: RequestInit = {
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
    // Check if the response is ok (status code 200-299)
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error:", errorData.message);
      return;
    }
    // Parse the response data and log it
    const responseData = await response.json();

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

export async function deleteFolder(FolderName: string) {
  const options: RequestInit = {
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
    // Check if the response is ok (status code 200-299)
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error:", errorData.message);
      return;
    }
    // Parse the response data and log it
    const responseData = await response.json();
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
