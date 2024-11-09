import React from 'react';
import ImageUploadForm from './components/imageUploadForm';
import './components/CustomStyles.css';

function App() {
  return (
    <div className="App min-vh-100 d-flex align-items-center">
      <div className="container">
        <h1 className="text-center mb-4 gradient-text">Unfazed Kikz - Shoe Upload</h1>
        <ImageUploadForm />
      </div>
    </div>
  );
}

export default App;