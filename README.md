# Project Management System (PMS)

This is the Project Management System (PMS) web application. It provides a centralized platform to plan, track, and manage projects efficiently.

## Overview

The PMS welcome page (`public/welcome.html`) serves as the opening page for users, introducing key features such as Dashboard, Task Management, and Collaboration. The page is styled with custom CSS located in `public/css/pms-style.css` to provide a clean and professional look.

## Features

- **Dashboard:** Overview of projects, tasks, and deadlines.
- **Task Management:** Create, assign, and track tasks.
- **Collaboration:** Communicate and collaborate with team members seamlessly.

## Project Structure

- `public/` - Contains static assets including HTML, CSS, images, and JavaScript.
  - `welcome.html` - The main welcome page for the PMS.
  - `css/pms-style.css` - Custom CSS styles for the PMS welcome page.
- `src/` - Source code for the backend and application logic (not detailed here).
- `bin/`, `config/`, `test/` - Other project directories for scripts, configuration, and tests.

## How to Use

1. Open `public/welcome.html` in a web browser to view the welcome page.
2. Customize the page and styles as needed to fit your project requirements.
3. Integrate with backend services and functionality as per your project setup.

## Dependencies

- Bootstrap Grid CSS is used for layout (`https://cdn.jsdelivr.net/npm/bootstrap@5/dist/css/bootstrap-grid.min.css`).
- No additional JavaScript dependencies are included by default on the welcome page.

## License

This project is MIT licensed. See the [LICENSE](https://github.com/GenieFramework/Genie.jl/blob/master/LICENSE.md) for details.

## Contributors

Created by [Adrian Salceanu](https://github.com/essenciary) and awesome contributors.

---

This README provides a starting point for understanding and using the Project Management System welcome page and its styling.

## Authentication

This application includes user authentication functionality with signup and login features.

- User credentials are stored in a CSV file (`peoples.csv`) located in the project root.
- Passwords are securely hashed using SHA-256 and Base64 encoding before storage.
- Signup endpoint: `POST /signup` accepts `firstName`, `lastName`, `email`, `password`, and `terms` (must be accepted).
- Login endpoint: `POST /login` accepts `email` and `password` and returns user details on success.
- Static pages for authentication are served at:
  - `GET /signup` - Signup page
  - `GET /login` - Login page
  - `GET /` - Welcome page

### Running and Testing

- Ensure the CSV file `peoples.csv` exists or will be created automatically on first signup.
- Use the signup page to create new users; duplicate emails are not allowed.
- Use the login page to authenticate existing users.
- Passwords are never stored or transmitted in plain text.
- For development, you can test the endpoints using tools like Curl or Postman.

### Notes

- An authentication initializer file is located at `config/initializers/auth.jl` for future authentication-related setup.
