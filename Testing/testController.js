PDFDocument = require('pdfkit');
fs = require('fs');
doc = new PDFDocument

//Pipe its output somewhere, like to a file or HTTP response 
//See below for browser usage 
doc.pipe(fs.createWriteStream('output.pdf'))


//Add an image, constrain it to a given size, and center it vertically and horizontally 
doc.image('./test.jpg', {
    fit: [500, 400],
    align: 'center',
    valign: 'center'
});

doc.addPage()
    .image('./1.png', {
        fit: [500, 400],
        align: 'center',
        valign: 'center'
    });


doc.end()