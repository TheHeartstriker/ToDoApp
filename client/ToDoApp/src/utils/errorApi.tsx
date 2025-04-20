export async function errorChecker(response: any): Promise<any> {
  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`HTTP error ${response.status}: ${response.statusText}`);
    console.error("Response body:", errorBody);
    throw new Error(errorBody || `HTTP error ${response.status}`);
  }
  return response.json();
}
