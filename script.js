// Function to display CSV data in the table
function displayCSV(csvText) {
    const rows = csvText.trim().split('\n');
    tableBody.innerHTML = ''; // Clear previous data

    // Skip header row
    for (let i = 1; i < rows.length; i++) {
        const columns = rows[i].split(',');
        if (columns.length >= 6) {
            const [index, url, pictureUrl, desc, amount, type] = columns;
            const tr = document.createElement('tr');
            
            tr.innerHTML = `
                <td>${desc}</td>
                <td>${amount}</td>
                <td>${type}</td>
                <td><a href="${url}" target="_blank">View Item</a></td>
                <td><img src="${pictureUrl}" alt="Google Lens Search for ${desc}"></td>
            `;

            // Append the row to the table body
            tableBody.appendChild(tr);

            // Get the newly created image element
            const imageElement = tr.querySelector('img');

            // Add a click event listener to the image
            imageElement.addEventListener('click', () => {
                const lensUrl = `https://lens.google.com/search?p=${encodeURIComponent(imageElement.src)}&q=${encodeURIComponent(imageElement.alt)}`;
                window.open(lensUrl, '_blank');
            });
        }
    }
}
