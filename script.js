document.addEventListener('DOMContentLoaded', () => {
  const searchBar = document.getElementById('searchBar');
  const tableBody = document.querySelector('#rainmakerTable tbody');
  const statusMessage = document.getElementById('statusMessage');

  // Function to fetch and display the CSV data
  async function loadCSV() {
    try {
      const response = await fetch('rainmaker.csv'); // Use relative path if in same folder
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
        tr.innerHTML = `
          <td>${desc}</td>
          <td>${amount}</td>
          <td>${type}</td>
          <td><a href="${url}" target="_blank">View Item</a></td>
          <td><img src="${pictureUrl}" alt="Item Thumbnail"></td>
        `;
        tableBody.appendChild(tr);
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