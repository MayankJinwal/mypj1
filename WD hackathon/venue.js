document.addEventListener('DOMContentLoaded', function () {
    const fileInputs = document.querySelectorAll('.file-input');
    const bookingButtons = document.querySelectorAll('.book-btn');
    const bookingSummaryContainer = document.getElementById('booking-summary');

    // Handle file upload
    fileInputs.forEach((input) => {
        input.addEventListener('change', function () {
            const file = this.files[0];
            const relatedButton = this.nextElementSibling;  // Get the button next to file input

            if (file) {
                // Enable the booking button after file is uploaded
                relatedButton.classList.add('active');
                relatedButton.disabled = false;
            }
        });
    });

    // Handle booking request submission
    bookingButtons.forEach((button) => {
        button.addEventListener('click', function () {
            const venueName = this.closest('.venue-item').querySelector('h3').textContent;

            // Create a new booking summary item in a Zomato-style list
            const bookingSummaryHTML = `
                <div class="booking-summary-item">
                    <span class="venue-name">${venueName}</span>
                    <span class="booking-status pending">Pending</span>
                    <button class="cancel-btn">Cancel</button>
                </div>
            `;

            // Append the booking summary item to the summary section
            bookingSummaryContainer.innerHTML += bookingSummaryHTML;

            // Disable the button after request is sent
            this.textContent = 'Request Sent';
            this.disabled = true;

            // Handle cancel request dynamically
            handleCancelButtons();
        });
    });

    // Function to handle cancel buttons for all requests
    function handleCancelButtons() {
        const cancelButtons = document.querySelectorAll('.cancel-btn');

        cancelButtons.forEach((cancelButton) => {
            cancelButton.addEventListener('click', function () {
                const bookingItem = this.closest('.booking-summary-item');
                bookingItem.remove(); // Remove the item from the list
            });
        });
    }
});
