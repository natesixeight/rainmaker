document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('searchBar');
    const tableBody = document.querySelector('#rainmakerTable tbody');
    const statusMessage = document.getElementById('statusMessage');

    // Function to fetch and display the CSV data
    async function loadCSV() {
        try {
            const response = await fetch('rainmaker.csv');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const text = await response.text();
            displayCSV(text);
            statusMessage.textContent = 'Data loaded successfully.';
        } catch (error) {
            console.error('Could not load the CSV file:', error);
            statusMessage.textContent = 'Error: Could not load data.';
        }
    }

    // Call the function to load the data when the page loads
    loadCSV();

    // Event listener for search bar input
    searchBar.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        filterTable(searchTerm);
    });

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
                
                // Add a data attribute to the row for the picture URL
                tr.dataset.pictureUrl = pictureUrl;
                
                tr.innerHTML = `
                    <td>${desc}</td>
                    <td>${amount}</td>
                    <td>${type}</td>
                    <td><a href="${url}" target="_blank">View Item</a></td>
                    <td><img src="${pictureUrl}" alt="${desc}" style="cursor: pointer;"></td>
                `;
                
                tableBody.appendChild(tr);

                // Get the newly created image element
                const imageElement = tr.querySelector('img');

                // Add a click event listener to the image
                imageElement.addEventListener('click', () => {
                    const imageUrl = imageElement.src;
                    const description = imageElement.alt;
                    
                    // Create a form to programmatically submit the image URL to Google
                    const form = document.createElement('form');
                    form.action = 'https://www.google.com/searchbyimage/upload';
                    form.method = 'post';
                    form.target = '_blank';
                    form.enctype = 'multipart/form-data';
                    
                    // Hidden input for the image URL
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = 'image_url';
                    input.value = imageUrl;
                    
                    // Hidden input for the supplemental query
                    const queryInput = document.createElement('input');
                    queryInput.type = 'hidden';
                    queryInput.name = 'q';
                    queryInput.value = description;

                    form.appendChild(input);
                    form.appendChild(queryInput);
                    
                    // Temporarily add the form to the document, submit it, and then remove it
                    document.body.appendChild(form);
                    form.submit();
                    document.body.removeChild(form);
                });
            }
        }
    }

    // Function to filter the table based on search terms
    function filterTable(searchTerm) {
        const rows = tableBody.querySelectorAll('tr');
        const searchTerms = searchTerm.split(' ').filter(term => term.length > 0);

        rows.forEach(row => {
            const rowText = row.textContent.toLowerCase();
            let isMatch = false;

            if (searchTerms.length === 0) {
                isMatch = true;
            } else {
                isMatch = searchTerms.some(term => rowText.includes(term));
            }
            row.style.display = isMatch ? '' : 'none';
        });
    }
});
