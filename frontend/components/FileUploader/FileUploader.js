import tus from 'tus-js-client';
import { Button } from '@material-ui/core';

const FileUploader = () => {
  const handleInputChange = e => {
    const file = e.target.files[0];

    const upload = new tus.Upload(file, {
      endpoint: '/api/upload',
      retryDelays: [0, 3000, 5000, 10000, 20000],
      metadata: {
        filename: file.name,
        filetype: file.type,
      },
      headers: {
        Authorization: localStorage.getItem('token'),
      },
      onError: function(error) {
        console.log('Failed because: ' + error);
      },
      onProgress: function(bytesUploaded, bytesTotal) {
        const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);

        console.log(bytesUploaded, bytesTotal, percentage + '%');
      },
      onSuccess: function() {
        console.log('Download %s from %s', upload.file.name, upload.url);
      },
    });

    e.target.value = '';

    upload.start();
  };

  return (
    <div>
      <input
        id="contained-button-file"
        onChange={handleInputChange}
        accept="image/*"
        style={{ display: 'none' }}
        multiple
        type="file"
      />
      <label htmlFor="contained-button-file">
        <Button variant="contained" component="span">
          Upload
        </Button>
      </label>
    </div>
  );
};

export default FileUploader;
