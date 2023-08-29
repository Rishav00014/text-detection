function previewImage(event) {
    const reader = new FileReader();
    reader.onload = function() {
        const image = new Image();
        image.src = reader.result;
        image.onload = function() {
            const canvas = document.getElementById('canvas');
            canvas.width = image.width;
            canvas.height = image.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0, image.width, image.height);
        };
    };
    reader.readAsDataURL(event.target.files[0]);
}

function extractText() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    Tesseract.recognize(
        canvas,
        'eng',
        { logger: m => console.log(m) }
    ).then(({ data }) => {
        data.words.forEach(word => {
            const bbox = word.bbox;
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 2;
            ctx.strokeRect(bbox.x0, bbox.y0, bbox.x1 - bbox.x0, bbox.y1 - bbox.y0);
            
            const tbody = document.getElementById('outputBody');
            const row = tbody.insertRow();
            row.insertCell().textContent = word.text;
            row.insertCell().textContent = bbox.x0;
            row.insertCell().textContent = bbox.y0;
            row.insertCell().textContent = bbox.x1;
            row.insertCell().textContent = bbox.y1;
        });
    });
}
