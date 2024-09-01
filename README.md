# Get Ethereum Transactions

**Endpoint:** `/api/transactions`

**Method:** `GET`

**Description:** Fetches Ethereum transactions for a given address and returns the list of transactions.

**Request Parameters:**

- `address` (optional, but required if not provided in the request body) - Ethereum address to fetch the transactions for.

**Request Body (optional):**

```json
{
  "address": "0xETHAddress"
}
```

**Example Request (Query Parameter):**

```
curl -X GET "http://localhost:8080/api/transactions?address=0xETHAddress"
```

**Example Request (Request Body):**

```
curl -X GET "http://localhost:8080/api/transactions" -H "Content-Type: application/json" -d '{"address":"0xETHAddress"}'
```

## 2. Get Total Expenses and Current Ether Price

**Endpoint:** `/api/expenses`

**Method:** `GET`

**Description:** Calculates the total expenses for a user and returns the current price of Ether.

**Request Parameters:**

- `address` (optional, but required if not provided in the request body) - Ethereum address to calculate the expenses for.

**Request Body (optional):**

```json
{
  "address": "0xETHAddres"
}
```

**Example Request (Query Parameter):**

```
curl -X GET "http://localhost:8080/api/expenses?address=0xETHAddress"
```

**Example Request (Request Body):**

```
curl -X GET "http://localhost:8080/api/expenses" -H "Content-Type: application/json" -d '{"address":"0xETHAddress"}'
```

## Setup

To set up the project:

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   ```

2. **Navigate to the project directory:**

   ```bash
   cd <project-directory>
   ```

3. **Install the dependencies:**

   ```bash
   npm install
   ```

4. **Create a `.env` file and add your MongoDB connection string and any other environment variables.**

5. **Start the server:**
   ```bash
   npm start
   ```
