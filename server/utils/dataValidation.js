//
// Example:
// const var = 123;
// const data = [{ var}];
// const fieldTypes = [["var", "number", 3]];
// validateData(data, fieldTypes);

//This takes data and checks it for type and length
export function validateData(data, fieldTypes) {
  if (!Array.isArray(data)) {
    throw new Error("Data must be an array");
  }
  //iterates over data
  data.forEach((item, index) => {
    if (typeof item !== "object" || item === null) {
      throw new Error(`Item at index ${index} is not an object`);
    }
    // Checks its name and type
    fieldTypes.forEach(([field, expectedType, length]) => {
      const value = item[field];
      //Checks if the field exists
      if (value === undefined || value === null) {
        throw new Error(`Missing required field '${field}' at index ${index}`);
      }
      //Type check
      if (typeof value !== expectedType) {
        throw new Error(
          `Field '${field}' at index ${index} should be '${expectedType}', got '${typeof value}'`
        );
      }
      //Checks length
      if (
        length != null &&
        ((expectedType === "string" && typeof value === "string") ||
          (expectedType === "array" && Array.isArray(value)) ||
          (expectedType === "object" &&
            typeof value === "object" &&
            value !== null)) &&
        (typeof value === "string" || Array.isArray(value)
          ? value.length > length
          : Object.keys(value).length > length) // For objects
      ) {
        throw new Error(
          `Field '${field}' at index ${index} exceeds maximum length of ${length}`
        );
      }
    });
  });
}
