// Load product data
document.addEventListener("DOMContentLoaded", () => {
    const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSoMYCaDRNi6UvQtcZglnsAa5gH3bwQbffaCXsOyadkpsQz_w9vfvwjZyAQ9l_3b9Q6hCxfkqckG0Ds/pub?output=csv";
  
    Papa.parse(sheetURL, {
      download: true,
      header: true,
      complete: function (results) {
        const data = results.data;
        const container = document.getElementById("product-cards");
  
        if (!container || !data.length) return;
  
        data.forEach(product => {
          if (!product["Product Title"]) return;
  
          const card = document.createElement("div");
          card.className = "card";
  
          const features = product.Features
            ? product.Features.split(/,\s*|\n/).map(f => `<li>${f.trim()}</li>`).join('')
            : '';
  
          card.innerHTML = `
            <h3>${product.Icon || ""} ${product["Product Title"]}</h3>
            <p>${product.Description || ""}</p>
            <ul>${features}</ul>
          `;
  
          container.appendChild(card);
        });
      }
    });
  });
  
  // Open the modal form
  function openModal(jobTitle) {
    const modal = document.getElementById("apply-modal");
    modal.style.display = "block";
    document.getElementById("apply-form").dataset.jobTitle = jobTitle; // Store job title in form
  }
  
  // Close the modal form
  function closeModal() {
    const modal = document.getElementById("apply-modal");
    modal.style.display = "none";
  }
  
  // Handle form submission
  document.getElementById("apply-form").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const name = document.getElementById("applicant-name").value;
    const email = document.getElementById("applicant-email").value;
    const resumeLink = document.getElementById("resume-link").value;
    const jobTitle = e.target.dataset.jobTitle; // Retrieve job title from form
  
    // Google Apps Script Web App URL for saving applications
    const scriptURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQlohPIPayjz86nzs0Z8_9JdZP-Qq8SBKqmCjCvZ6M7oUTKQjIAWOW2J3Up3Do3M2Dklyx4ky56YV4z/pub?output=csv";
  
    // Send data to Google Spreadsheet
    fetch(scriptURL, {
      method: "POST",
      body: JSON.stringify({ name, email, resumeLink, jobTitle }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          alert("Application submitted successfully!");
          closeModal();
          e.target.reset(); // Reset the form
        } else {
          alert("Failed to submit application. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      });
  });
  
  // Load job postings from Google Spreadsheet
  document.addEventListener("DOMContentLoaded", () => {
    const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSzfajTgAlCM3VSehdnLfikZ2EU87Hen4cpedD1YznR5V89kO3oodvn_c6WEb5xfESY2jPBgN-wPz1b/pub?output=csv";
  
    Papa.parse(sheetURL, {
      download: true,
      header: true,
      complete: function (results) {
        const data = results.data;
        const container = document.getElementById("job-listings");
  
        if (!container || !data.length) {
          console.error("No job listings found or container is missing.");
          return;
        }
  
        data.forEach(job => {
          if (!job["Job Title"]) return;
  
          const card = document.createElement("div");
          card.className = "card";
  
          card.innerHTML = `
            <h3>${job["Job Title"]}</h3>
            <p><strong>Location:</strong> ${job["Location"] || "Remote"}</p>
            <p><strong>Type:</strong> ${job["Job Type"] || "Full-Time"}</p>
            <p>${job["Description"] || "No description available."}</p>
            <button class="apply-btn" onclick="openModal('${job["Job Title"]}')">Apply Now</button>
          `;
  
          container.appendChild(card);
        });
      },
      error: function (error) {
        console.error("Error loading job postings:", error);
      }
    });
  });