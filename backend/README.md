# Backend Setup and Usage

This document provides instructions on how to set up and run the backend application for the project.

## Prerequisites

*   **Node.js:** Ensure you have Node.js installed (which includes npm). You can download it from [https://nodejs.org/](https://nodejs.org/).

## Setup Instructions

1.  **Navigate to Backend Directory:**
    All subsequent commands should be run from the `backend` directory.
    ```bash
    cd backend
    ```

2.  **Set Up Environment Variables:**
    *   Insert `.env` file in the `backend` directory.

3.  **Install Dependencies:**
    Install the necessary Node.js packages defined in `package.json`.
    ```bash
    npm install
    ```

## Database Setup
*   **Format Schema:**
    To automatically format your `prisma/schema.prisma` file for readability and consistency:
    ```bash
    npx prisma format
    ```

*   **Apply Schema Migrations:**
    This command connects to the Supabase database (using the `DATABASE_URL` from `.env`), applies any pending schema migrations defined in `prisma/schema.prisma`, and generates the Prisma Client code.
    ```bash
    npx prisma migrate dev
    ```
    *(Note: If you only need to regenerate the Prisma Client without running migrations, you can use `npx prisma generate`)*

## Running the Application

1.  **Development Mode:**
    Starts the server using `nodemon`, which automatically restarts the server when file changes are detected.
    ```bash
    npm run dev
    ```
    The server will be available at `http://localhost:3001`.

2.  **Production Mode:**
    Starts the server using `node`.
    ```bash
    npm start
    ```

## Running Tests

This project uses Jest for unit testing. To run the tests:

1.  **Ensure Development Dependencies are Installed:**
    Make sure you have run `npm install` in the `backend` directory, as Jest is a development dependency.

2.  **Run Tests:**
    Execute the following command from the `backend` directory:
    ```bash
    npm test
    ```
    This will discover and run all test files (typically ending in `.test.js`) within the project.

## Building the Application
