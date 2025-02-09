# Budget Tracker

## Overview

Budget Tracker is a simple web-based application that helps users track their expenses efficiently. It provides a user-friendly interface to add, view, and categorize expenses while allowing currency conversions for better financial management.

## Features

- Add new expenses with a description, amount, category, and currency.
- Convert expenses into a base currency for consistent tracking.
- View categorized summaries of expenses.
- Store and persist expenses using `localStorage`.
- Edit and delete expenses.
- Responsive design for mobile and desktop.

## Technologies Used

- **HTML**: Structure of the application.
- **CSS**: Styling and responsive design.
- **JavaScript**: Logic for adding, editing, deleting, and displaying expenses.
- **LocalStorage**: Persistent data storage.
- **Web Storage API**: Enables session-based or local storage.
- **Frankfurter API**: Fetches real-time currency exchange rates.

## Live Demo

The Budget Tracker is deployed on **Vercel** and can be accessed here:  
🔗 **[Budget Tracker Live](https://budgettracker2.vercel.app/)**  

## API Usage

### 1. Frankfurter API

- **Endpoint**: `https://api.frankfurter.app/latest`
- **Purpose**: Fetches real-time exchange rates to support currency conversion.
- **Implementation**:
  ```javascript
  async function fetchExchangeRates() {
      try {
          const response = await fetch('https://api.frankfurter.app/latest');
          const data = await response.json();
          Object.assign(exchangeRates, data.rates, { [data.base]: 1 });
      } catch (error) {
          console.error('Error fetching exchange rates:', error);
      }
  }
  
  fetchExchangeRates();
  ```

### 2. Local Storage API

```javascript
// Save expenses to localStorage
function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Load expenses from localStorage
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
```

### 3. Web Storage API

```javascript
// Store data in sessionStorage (clears when session ends)
sessionStorage.setItem('sessionData', 'Temporary Data');

// Retrieve data from sessionStorage
let sessionData = sessionStorage.getItem('sessionData');
```

## Installation & Usage

### Prerequisites

- Node.js installed on your system.
- A local web server (e.g., `http-server`).

### Steps

1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/budget-tracker.git
   ```
2. Navigate to the project directory:
   ```bash
   cd budget-tracker
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm run dev
   ```
5. Open your browser and go to:
   ```
   http://localhost:8080
   ```

## File Structure

```
├── index.html        # Main HTML file
├── style.css         # Stylesheet
├── script.js         # JavaScript logic
├── package.json      # Project metadata
├── package-lock.json # Dependency lock file
```

## Future Enhancements

- Integrate authentication and user profiles.
- Implement data visualization with charts.
- Export expenses as CSV or PDF.

## Contributors

- Rajasurya J

## Feedback

If you have suggestions or find bugs, feel free to open an issue on GitHub!

 
