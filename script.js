document.getElementById('pdf-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const { jsPDF } = window.jspdf;

    const userImageFile = document.getElementById('userImage').files[0];
    const userName = document.getElementById('name').value;
    const fatherName = document.getElementById('fatherName').value;
    const cnic = document.getElementById('cnic').value;
    const course = document.getElementById('course').value;

    const cardFront = new Image();
    cardFront.src = './card-front.png';
    const cardBack = new Image();
    cardBack.src = './card-back.png';

    // Wait for both card images to load
    await Promise.all([imageLoad(cardFront), imageLoad(cardBack)]);

    const userImage = await loadImageFile(userImageFile);

    const canvas = document.getElementById('cardCanvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size to match the front card image
    canvas.width = cardFront.width;
    canvas.height = cardFront.height;

    // Draw the front card
    ctx.drawImage(cardFront, 10, 10);

    // Draw the user image in the circle (adjust coordinates accordingly)
    const circleX = 1200; // Example coordinate
    const circleY = 1200; // Example coordinate
    const circleDiameter = 1900;
    ctx.drawImage(userImage, circleX, circleY, circleDiameter, circleDiameter);

    // Write the user's details on the front card
    ctx.font = '106px Arial';
    ctx.fillText(userName, 200, 100); // Adjust coordinates
    ctx.fillText(fatherName, 200, 130);
    ctx.fillText(cnic, 200, 160);
    ctx.fillText(course, 200, 190);

    // Convert the canvas content to an image
    const cardFrontImage = canvas.toDataURL('image/png');

    // Now, create the PDF using jsPDF
    const doc = new jsPDF('landscape');
    doc.addImage(cardFrontImage, 'PNG', 10, 10, 100, 140); // Adjust size and position
    doc.addImage(cardBack.src, 'PNG', 120, 10, 100, 140); // Place the back card on the right side

    // Save the generated PDF
    doc.save('id_card.pdf');
});

// Helper functions
function imageLoad(img) {
    return new Promise(resolve => {
        img.onload = resolve;
    });
}

function loadImageFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.src = reader.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
