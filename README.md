# 🎓 Student Support System

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.2.4-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0.1-646CFF.svg)](https://vite.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-Database-orange.svg)](https://www.mysql.com/)
[![Gemini](https://img.shields.io/badge/AI-Google%20Gemini%20Pro-red.svg)](https://deepmind.google/technologies/gemini/)

A full-stack web application designed to monitor student academic performance, track attendance, and provide automated AI-driven pedagogical support. By leveraging the Google Gemini API, the system automatically analyzes student performance and generates targeted, actionable study tips to guide students who need support.

---

## 🚀 Key Features

*   **🔑 Secure Authentication**: Simple registration and login workflow supporting custom dashboard views for administrators and students.
*   **📋 Student Directory**: Full CRUD operations for managing student profiles (ID, Name, Email, Department, and Academic Year).
*   **📊 Academic Performance Tracking**: Register and view detailed academic marks/scores by subject.
*   **📅 Attendance Management**: Record and track student attendance history.
*   **🤖 AI-Powered Support**: Integrates Google Gemini API (`gemini-pro`) to analyze performance metrics and automatically generate practical, under-20-word study tips for students.
*   **🔔 Active Alerts System**: Automated alerts triggered by key system actions (e.g. low attendance, low test scores, or AI study suggestions) to keep students and administrators in the loop.

---

## 🛠️ Technology Stack

### Backend
*   **Framework**: Spring Boot 3.2.0 (Java 17)
*   **Database Access**: Spring Data JPA & Hibernate
*   **Database**: MySQL (Hosted on Aiven Cloud / Local MySQL)
*   **Utilities**: Lombok, dotenv-java (for environment configuration)
*   **Build Tool**: Maven

### Frontend
*   **Build Tool**: Vite
*   **Framework**: React 19
*   **Routing**: React Router DOM v7
*   **Icons**: Lucide React
*   **Styles**: Vanilla CSS (Tailwind-ready structure)

---

## 🌐 API Architecture & Endpoints

All backend endpoints are prefixed with `/api` and support Cross-Origin Resource Sharing (CORS).

| Endpoint | Method | Description | Payload / Parameters |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Register a new user | `User` (JSON) |
| `/api/auth/login` | `POST` | Login user, returns session token & role | `{ "email", "password" }` |
| `/api/students` | `POST` | Create a student profile | `Student` (JSON) |
| `/api/students` | `GET` | Retrieve all student profiles | N/A |
| `/api/students/{id}` | `GET` | Get detailed student profile | N/A |
| `/api/students/{id}` | `PUT` | Update a student profile | `Student` (JSON) |
| `/api/students/{id}` | `DELETE` | Delete a student profile | N/A |
| `/api/marks` | `POST` | Add academic marks for a student | `MarksDTO` (JSON) |
| `/api/marks` | `GET` | Retrieve all marks | N/A |
| `/api/marks/student/{id}` | `GET` | Retrieve marks for a specific student | N/A |
| `/api/attendance` | `POST` | Record student attendance | `AttendanceDTO` (JSON) |
| `/api/attendance` | `GET` | Retrieve all attendance records | N/A |
| `/api/attendance/student/{id}` | `GET` | Retrieve attendance history for a student | N/A |
| `/api/alerts/student/{id}` | `GET` | Get all alerts/notifications for a student | N/A |
| `/api/alerts/student/{id}/unread`| `GET` | Get unread alerts/notifications | N/A |
| `/api/alerts/{alertId}/read` | `PUT` | Mark an alert as read | N/A |
| `/api/ai/suggest` | `GET` | Generate suggestions via Gemini API | `subject` (String), `percentage` (Double) |

---

## 📦 Project Structure

```text
student-support-system/
├── src/main/java/com/example/demo/
│   ├── StudentSupportSystemApplication.java   # App entry point
│   ├── AuthController.java                    # Auth endpoints (login/register)
│   ├── StudentController.java                 # Student profile CRUD REST Controller
│   ├── MarksController.java                   # Marks logging & retrieval
│   ├── AttendanceController.java              # Attendance logs
│   ├── AlertController.java                   # System alerts & notifications
│   ├── AIController.java                      # Gemini API suggestion gateway
│   ├── AIService.java                         # Gemini API client Integration
│   └── [Models/Repositories/Services]         # Domain layers & DB repositories
├── src/main/resources/
│   └── application.properties                 # Spring Boot application configuration
├── frontend/
│   ├── src/
│   │   ├── api/config.js                      # API base URL & client setup
│   │   ├── components/layout/                 # TopNavbar, Sidebar, DashboardLayout
│   │   ├── pages/                             # Login, Overview, StudentDirectory, MarksDirectory, AttendanceDirectory
│   │   ├── App.jsx                            # App Router & views matching roles
│   │   └── index.css                          # Design tokens & styles
│   ├── package.json                           # Frontend configurations & NPM modules
│   └── vite.config.js                         # Vite compiler configs
├── Dockerfile                                 # Multi-stage production container configuration
├── .env                                       # Local environment file (DB Credentials)
└── pom.xml                                    # Maven backend configuration
```

---

## ⚙️ Development Setup

Follow these steps to run the application locally.

### Prerequisites
*   **Java**: JDK 17 or higher
*   **Node.js**: Node 18+ & npm
*   **Database**: MySQL database instance

---

### 1. Backend Configuration

Create a `.env` file in the **root** directory (peer to `pom.xml`) containing your database credentials:

```env
url=jdbc:mysql://localhost:3306/student_support_db?createDatabaseIfNotExist=true&useSSL=false
username=your_mysql_username
password=your_mysql_password
```

Ensure your `src/main/resources/application.properties` specifies the correct system secrets:

```properties
spring.datasource.url=${url}
spring.datasource.username=${username}
spring.datasource.password=${password}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

server.port=8080

jwt.secret=StudentSupportSystem@SecretKey#2024$Secure!
ai.api.key=YOUR_GEMINI_API_KEY
```

> 💡 **Gemini API Access**: Replace `YOUR_GEMINI_API_KEY` with a valid Google Gemini API Key. You can get one from Google AI Studio.

#### Running the Backend
From the root directory, run the Maven wrapper to build and start the Spring Boot app:

**On Windows:**
```cmd
mvnw.cmd spring-boot:run
```

**On macOS / Linux:**
```bash
chmod +x mvnw
./mvnw spring-boot:run
```
The server will boot up on [http://localhost:8080](http://localhost:8080).

---

### 2. Frontend Configuration

Navigate to the `frontend` directory:
```bash
cd frontend
```

#### Running the Frontend
Install dependencies:
```bash
npm install
```

Start the Vite development server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

> 🛠️ **API Endpoints**: The client connects to the production API by default (configured in `frontend/src/api/config.js`). To point the client to your local backend, set the environment variable `VITE_API_BASE_URL` to `http://localhost:8080/api` or change the default fallback in the config file.

---

## 🐳 Docker Deployment

A multi-stage `Dockerfile` is provided in the root directory to package the application.

1.  **Build the Docker Image**:
    ```bash
    docker build -t student-support-system .
    ```

2.  **Run the Container**:
    Make sure to pass environment variables corresponding to your production database credentials:
    ```bash
    docker run -d -p 8080:8080 \
      -e url="jdbc:mysql://your-db-host:3306/db_name" \
      -e username="db_user" \
      -e password="db_password" \
      student-support-system
    ```

---

## 🛡️ License

This project is licensed under the MIT License - see the LICENSE file for details.
