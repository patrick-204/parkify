import React from 'react';
import './App.css';

function App() {
  // Define the fetchPhotos function to be used as an event handler
  const fetchPhotos = () => {
    fetch('http://localhost:8080/api/users')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Data received from backend:', data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  // Return the JSX for rendering the component
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchPhotos}>Fetch Photos</button>
      </header>
    </div>
  );
}

export default App;

/* useEffect(() => {
  fetch('http://localhost:8080/users')
    .then((res) => res.json())
    .then((data) => {
      console.log(data); 
    })
    .catch((error) => {
      console.error('Error fetching photos:', error);
    });
}, []);

*/ 