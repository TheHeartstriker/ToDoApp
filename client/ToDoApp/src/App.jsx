import { useState, useEffect } from "react";

function App() {
  const [Data, setData] = useState([{}]);

  useEffect(() => {
    fetch("/api")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server responded with status ${res.status}`);
        }
        return res.text(); // Temporarily use text() to inspect the raw response
      })
      .then((text) => {
        console.log("Raw response:", text);
        return JSON.parse(text); // Manually parse the text as JSON
      })
      .then((data) => setData(data.Users))
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  return (
    <>
      <h1>Users</h1>
      <ul>
        {Data.map((user, index) => (
          <li key={index}>{user}</li>
        ))}
      </ul>
    </>
  );
}

export default App;
