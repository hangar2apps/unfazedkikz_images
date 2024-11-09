import React, { useState } from 'react';
import './CustomStyles.css';

function ImageUploadForm() {
  const [shoeBrand, setShoeBrand] = useState('');
  const [shoeName, setShoeName] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  const handleShoeBrandChange = (e) => {
    setShoeBrand(e.target.value);
  };

  const handleShoeNameChange = (e) => {
    setShoeName(e.target.value);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!shoeBrand || !shoeName || !file) return;

    setUploading(true);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shoeBrand,
          shoeName,
          imageData: previewUrl
        })
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      console.log('response data', data);

      let url = data.url;
      //need to add url and shoe name to blob
      



      setUploadedImageUrl(data.url);
      alert('Image uploaded successfully!');
      // Reset form
      clearForm();
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const clearForm = () => {
    setShoeBrand('');
    setShoeName('');
    setFile(null);
    setPreviewUrl(null);
    setUploadedImageUrl(null);
    // Reset the file input
    const fileInput = document.getElementById('image');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={handleSubmit} className="p-4 custom-form">
            <div className="mb-3">
              <label htmlFor="shoeBrand" className="form-label">Shoe Brand</label>
              <input
                id="shoeBrand"
                type="text"
                className="form-control custom-input"
                value={shoeBrand}
                onChange={handleShoeBrandChange}
                required
                disabled={uploading}
                placeholder="Enter shoe brand"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="shoeName" className="form-label">Shoe Name</label>
              <input
                id="shoeName"
                type="text"
                className="form-control custom-input"
                value={shoeName}
                onChange={handleShoeNameChange}
                required
                disabled={uploading}
                placeholder="Enter shoe name"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="image" className="form-label">Shoe Image</label>
              <input
                id="image"
                type="file"
                className="form-control custom-input custom-file-input"
                accept="image/*"
                onChange={handleFileChange}
                required
                disabled={uploading}
              />
            </div>
            {previewUrl && (
              <div className="mb-3">
                <img src={previewUrl} alt="Preview" className="img-fluid rounded" style={{ maxHeight: '200px' }} />
              </div>
            )}
            <div className="d-flex justify-content-between">
              <button type="submit" className="btn custom-btn text-white" disabled={!shoeBrand || !shoeName || !file || uploading}>
                {uploading ? 'Uploading...' : 'Upload Shoe'}
              </button>
              <button type="button" className="btn btn-outline-light" onClick={clearForm} disabled={uploading}>
                Clear Form
              </button>
            </div>
            {uploadedImageUrl && (
              <div className="mt-3 text-center">
                <p className="text-success">Image uploaded successfully!</p>
                <a href={uploadedImageUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light">View uploaded image</a>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default ImageUploadForm;