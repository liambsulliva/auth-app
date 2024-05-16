# Auth App

This is a simple authentication app that allows users to register a username and password, encrypts the password using bcrypt, and stores the credentials in MongoDB for later access on the login page.

## Prerequisites

Before running this application, make sure you have the following:

- Node.js
- MongoDB
- Express
- Bcrypt
- Mongoose

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/auth-app.git
    ```

2. Install the dependencies:

    ```bash
    cd auth-app
    npm install
    ```

3. Set up the MongoDB connection:

    - Open `.env` and update the DATABASE_URL environment variable with your own MongoDB database.

4. Start the application:

    ```bash
    npm start
    ```

## Usage

1. Open your web browser and navigate to `http://localhost:3000`, or use the Github Live Preview: `https://liam-auth-app.adaptable.app`.
2. Register a new account by providing a username and password.
3. The password will be encrypted using bcrypt and stored in the MongoDB database.
4. You can now use the registered credentials to log in on the login page.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.