class Customer {
  constructor(regID, Name1, Name2, PhoneNo, Email, Password, Gender, RegType, accStatus, Balance) {
      this.regID = regID;
      this.Name1 = Name1;
      this.Name2 = Name2;
      this.PhoneNo = PhoneNo;
      this.Email = Email;
      this.Password = Password;
      this.Gender = Gender;
      this.RegType = RegType;
      this.accStatus = accStatus;
      this.Balance = Balance;
  }

  async newCustomer(dLocation) {
      const customerData = {
          Name1: this.Name1,
          Name2: this.Name2,
          PhoneNo: this.PhoneNo,
          Email: this.Email,
          Password: this.Password, // Ensure password is hashed server-side for security
          Gender: this.Gender,
          dLocation, // Dynamically provided by the UI
          RegType: "Customer",
          accStatus: "Pending"
      };

      try {
          const response = await fetch('/registration.php', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(customerData),
          });

          const result = await response.json();

          if (result.success) {
              console.log("Customer registration successful:", result.message);
              return result;
          } else {
              console.error("Customer registration failed:", result.error);
              return result;
          }
      } catch (error) {
          console.error("An error occurred while creating the customer:", error);
          throw error;
      }
  }

  async getCustomer() {
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const errorElement = document.getElementById('loginError');

      errorElement.textContent = '';

      if (!email || !password) {
          errorElement.textContent = "Please fill in both fields.";
          return;
      }

      try {
          const response = await fetch('registration.php', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password })
          });

          const result = await response.json();

          if (result.success && result.accStatus === 'Approved') {
              localStorage.setItem('regId', result.CustomerID);
              window.location.href = 'custDashboard.php';
          } else {
              errorElement.textContent = "Invalid Email or Password";
          }
      } catch (error) {
          console.error("Error fetching customer details:", error);
      }
  }

  async getBalance() {
      const regId = localStorage.getItem('regId');

      if (!regId) {
          console.error('User not logged in');
          return;
      }

      try {
          const response = await fetch(`finance.php?CustomerID=${regId}`);

          if (!response.ok) {
              throw new Error('Error fetching balance');
          }

          const data = await response.json();

          if (data.error) {
              console.error('Error fetching balance:', data.error);
          } else {
              const balanceElement = document.getElementById('balance');
              balanceElement.textContent = `Balance: ${data.Amount}`;
          }
      } catch (error) {
          console.error(error);
      }
  }

  async hireBand() {
      const genres = ['Reggae', 'Rhumba', 'Zilizopendwa', 'Benga', 'Soul', 'RnB'];
      const costPerHour = {
          Reggae: 3000,
          Rhumba: 3500,
          Zilizopendwa: 2500,
          Benga: 2900,
          Soul: 4000,
          RnB: 4500
      };

      const populateDropdown = (dropdown, options) => {
          dropdown.innerHTML = '';
          options.forEach(option => {
              const element = document.createElement('option');
              element.value = option;
              element.textContent = option;
              dropdown.appendChild(element);
          });
      };

      const genreDropdown = document.getElementById("genreDropdown");
      populateDropdown(genreDropdown, genres);

      const hoursDropdown = document.getElementById("hoursDropdown");
      populateDropdown(hoursDropdown, Array.from({ length: 10 }, (_, i) => `${i + 1} Hour${i > 0 ? 's' : ''}`));

      document.getElementById("bookBandBtn").addEventListener("click", async () => {
          const genre = genreDropdown.value;
          const hours = parseInt(hoursDropdown.value, 10);
          const bookingDate = document.getElementById("bookingDate").value;

          if (!genre || !hours || !bookingDate) {
              alert("Please fill all fields.");
              return;
          }

          const cost = costPerHour[genre] * hours;

          const bookingData = {
              ServiceType: "Booking",
              Genre: genre,
              BookingDate: bookingDate,
              Cost: cost,
              Hours: hours,
              ServiceID: localStorage.getItem('regId'),
              BookStatus: "Untick"
          };

          try {
              const response = await fetch("serviceRequest.php", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(bookingData)
              });

              const result = await response.json();

              if (response.ok) {
                  alert("Band booking successful!");
              } else {
                  alert(`Error: ${result.error}`);
              }
          } catch (error) {
              console.error("Error booking band:", error);
          }
      });
  }

  async hireSoundSystem() {
      try {
          const response = await fetch("equipment.php", { method: "GET" });
          const inventory = await response.json();

          const availableEquipment = inventory.filter(item => item.Availability === "Available");

          if (availableEquipment.length === 0) {
              alert("No equipment available for hire.");
              return;
          }

          const equipmentDropdown = document.getElementById("equipmentDropdown");
          populateDropdown(equipmentDropdown, availableEquipment.map(item => `${item.Description} (ID: ${item.EquipmentID})`));

          document.getElementById("hireEquipmentBtn").addEventListener("click", async () => {
              const selectedEquipmentID = equipmentDropdown.value;
              const lendingDate = document.getElementById("lendingDate").value;
              const hours = parseInt(document.getElementById("hours").value, 10);

              if (!selectedEquipmentID || !lendingDate || !hours) {
                  alert("Please fill all fields.");
                  return;
              }

              const selectedEquipment = availableEquipment.find(item => item.EquipmentID === parseInt(selectedEquipmentID, 10));
              const cost = selectedEquipment.Price * hours;

              const lendingData = {
                  ServiceType: "Lending",
                  EquipmentID: selectedEquipmentID,
                  LendingDate: lendingDate,
                  Cost: cost,
                  Hours: hours,
                  ServiceID: localStorage.getItem('regId'),
                  LendingStatus: "Yet"
              };

              const hireResponse = await fetch("serviceRequest.php", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(lendingData)
              });

              if (hireResponse.ok) {
                  alert("Equipment successfully hired!");

                  await fetch("equipment.php", {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ ...selectedEquipment, Availability: "Unavailable" })
                  });
              } else {
                  alert("Error hiring equipment.");
              }
          });
      } catch (error) {
          console.error("Error in hireSoundSystem:", error);
      }
  }

  async feedBack() {
      const feedbackContainer = document.getElementById('feedbackContainer');
      feedbackContainer.innerHTML = '';

      try {
          const response = await fetch('feedback.php', { method: 'GET' });
          const result = await response.json();

          if (result.length > 0) {
              result.forEach(feedback => {
                  const feedbackDiv = document.createElement('div');
                  feedbackDiv.classList.add('feedback-entry');

                  feedbackDiv.innerHTML = `
                      <h4>Name: ${feedback.Name}</h4>
                      <p>Comments: ${feedback.Comments}</p>
                      <p>Response: ${feedback.Response || 'No response yet'}</p>
                  `;

                  feedbackContainer.appendChild(feedbackDiv);
              });
          } else {
              feedbackContainer.textContent = 'No feedback available.';
          }
      } catch (error) {
          console.error("Error fetching feedback:", error);
          feedbackContainer.textContent = 'An error occurred while fetching feedback.';
      }
  }
}
