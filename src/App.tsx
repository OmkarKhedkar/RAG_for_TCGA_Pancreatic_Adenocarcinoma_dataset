//uvicorn app:app --reload --host 0.0.0.0 --port 8000
import React, { useState } from 'react';
import axios from 'axios';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [clinicalFile, setClinicalFile] = useState<File | null>(null);
  const [expressionFile, setExpressionFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleQuery = async () => {
    console.log('Submitting query:', query);
    setLoading(true);
    try {
      console.log('Sending request to backend...');
      const result = await axios.post('http://localhost:8000/query', { text: query });
      console.log('Received response:', result.data);
      setResponse(result.data.response);
    } catch (error) {
      console.error('Error querying:', error);
      setResponse('An error occurred while processing your query.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!clinicalFile || !expressionFile) return;
  
    const formData = new FormData();
    formData.append('clinical_file', clinicalFile);
    formData.append('expression_file', expressionFile);
  
    try {
      const result = await axios.post('http://localhost:8000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('Server response:', result.data);
      if (result.data.status === 'processed') {
        setUploadStatus(`Files uploaded and processed: ${result.data.records} records`);
      } else {
        setUploadStatus(`Error: ${result.data.message}`);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      setUploadStatus('Error uploading files');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Pancreatic Cancer Genomics RAG Application</h1>
      
      <div>
        <h2>Upload Data</h2>
        <input
          type="file"
          accept=".tsv"
          onChange={(e) => setClinicalFile(e.target.files ? e.target.files[0] : null)}
        />
        <label>Clinical Data File</label>
        <br />
        <input
          type="file"
          accept=".tsv"
          onChange={(e) => setExpressionFile(e.target.files ? e.target.files[0] : null)}
        />
        <label>Gene Expression Data File</label>
        <br />
        <button onClick={handleFileUpload}>Upload Files</button>
        {uploadStatus && <p>{uploadStatus}</p>}
      </div>

      <div>
        <h2>Query</h2>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your question about pancreatic cancer genomics"
          rows={4}
          style={{ width: '100%' }}
        />
        <br />
        <button onClick={handleQuery} disabled={loading}>
          {loading ? 'Loading...' : 'Submit Query'}
        </button>
      </div>

      {response && (
        <div>
          <h2>Response</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default App;