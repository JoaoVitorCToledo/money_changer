# Money Changer

This project is an example of an API made to convert currencies.

# Instalation
Requirements
- Node 18.XX.XX
- MongoDB

Clone the git repository and run 'npm install' to install the dependencies and 'npm run dev' to start the server

# Requests
## List users conversion requests
GET /users/:user_id/conversions

Returns an array of objects with its data

## Creates a conversion
POST /conversions

Required Parameters

  user_id: Number, a number to identify the user
  from: String, the three letter currency code (example BRL), its the original currency of the sum
  amount: Number, the original amount that will be converted
  to String, the three letter currency code (example BRL), its the currency the sum will be converted to
  
# Tests

To run tests run npm run test
