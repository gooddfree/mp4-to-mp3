document.getElementById('convertButton').addEventListener('click', function () {
    const fileInput = document.getElementById('videoUpload');
    if (fileInput.files.length === 0) {
        alert('Please upload an MP4 file first.');
        return;
    }

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('video', file);

    document.getElementById('status').textContent = 'Converting...';

    fetch('/convert', {
        method: 'POST',
        body: formData
    })
    .then(response => response.blob())
    .then(blob => {
        const downloadLink = document.getElementById('downloadLink');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = 'converted.mp3';
        downloadLink.style.display = 'block';
        downloadLink.click();
        document.getElementById('status').textContent = 'Conversion complete!';
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('status').textContent = 'Conversion failed.';
    });
});
