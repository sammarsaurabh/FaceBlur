var isUploading = false;
const videoPlayer = document.getElementById('player');
const dropzone = document.getElementById('drop_zone');
const fileInput = document.getElementById('file-input');
const uploadForm = document.getElementById('upload-form');
var loadingOverlay = document.getElementById('loading-overlay');
loadingOverlay.style.display = 'none';
dropzone.addEventListener('click', handleDropZoneClick);

function handleDropZoneClick() {
  fileInput.click();
}

fileInput.onchange = () => {
  const selectedFiles = [...fileInput.files];
  console.log(selectedFiles);
};

uploadForm.addEventListener('submit', handleSubmitForm);
// Show loading viewv

function handleSubmitForm(ev) {
  ev.preventDefault();
  const formData = new FormData(uploadForm);
  loadingOverlay.style.display = 'flex';
  fetch('http://localhost:8000/upload', {
    method: 'POST',
    body: formData
  })
    .then(response => {
      loadingOverlay.style.display = 'none';
      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('video/mp4')) {
        return response.blob();
      } else {
        throw new Error('Invalid response format');
      }
    })
    .then(blob => {
        const download = document.getElementById('downloadButton');
        download.style.display = "block";
        download.addEventListener('click', ()=>{
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");

          link.href = blobUrl;
          link.download = "video.mp4";

          document.body.appendChild(link);

          link.dispatchEvent(
            new MouseEvent('click', { 
              bubbles: true, 
              cancelable: true, 
              view: window 
            })
          );

          document.body.removeChild(link);
        });
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

function dropHandler(ev) {
  console.log('Files Dropped');
  ev.preventDefault();
  if (isUploading) {
    return;
  }

  isUploading = true;

  if (ev.dataTransfer.items) {
    const filesData = new DataTransfer();
    [...ev.dataTransfer.items].forEach((item, i) => {
      if (item.kind === 'file') {
        const file = item.getAsFile();
        filesData.items.add(file);
      }
    });
    console.log(filesData.files);
    fileInput.files = filesData.files;
  } else {
    const filesData = [];
    [...ev.dataTransfer.files].forEach((file, i) => {
      filesData.push(file);
      isUploading = false;
    });
    fileInput.files = filesData;
  }
}

function dragOverHandler(ev) {
  console.log('File(s) in drop zone');
  ev.preventDefault();
}
