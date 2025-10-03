# 🎓 Project Allocator & Management System 🚀  

  ![Build](https://img.shields.io/badge/build-passing-brightgreen)  
![Made with](https://img.shields.io/badge/Made%20with-React%20%26%20Node-blue)  

A **full-stack web application** designed to streamline the process of project group registration, supervisor assignment, and marks management for university projects.  
This system replaces the manual, paper-based workflow with an **efficient digital solution**.  

---

## ✨ Key Features  

| Feature             | Description                                                                 |
|---------------------|-----------------------------------------------------------------------------|
| 🧑‍🎓 **Student Portal**  | Register 5-member teams. Ensures a student cannot be part of multiple groups. |
| 👨‍🏫 **Supervisor Portal** | Supervisors can sign up, log in, view assigned groups, and enter review marks. |
| ⚙️ **Admin Panel**      | Create/manage accounts, view all data, and run an auto-assignment algorithm. |

---

## 💻 Tech Stack  

| Category        | Technology                                |
|-----------------|--------------------------------------------|
| 🎨 **Frontend** | React.js (Vite), Tailwind CSS              |
| ⚙️ **Backend**  | Node.js, Express.js                        |
| 🗄️ **Database** | PostgreSQL (Supabase)                      |
| 🔑 **Auth**     | JWT (JSON Web Tokens), bcrypt              |

---

## 📂 Project Structure  

```bash
📦 Capstone Project
 ┣ 📂 backend
 ┃ ┣ 📂 middleware
 ┃ ┣ 📂 routes
 ┃ ┣ 📜 db.js
 ┃ ┣ 📜 index.js
 ┃ ┣ 📜 package.json
 ┃ ┣ 📜 package-lock.json
 ┃ ┣ 📜 .gitignore
 ┃ ┗ 📜 .env
 ┣ 📂 frontend
 ┃ ┣ 📂 public
 ┃ ┣ 📂 src
 ┃ ┃ ┣ 📂 components
 ┃ ┃ ┃ ┣ 📜 AdminPanel.jsx
 ┃ ┃ ┃ ┣ 📜 GroupRegistration.jsx
 ┃ ┃ ┃ ┣ 📜 SupervisorDashboard.jsx
 ┃ ┃ ┃ ┗ 📜 SupervisorLogin.jsx
 ┃ ┃ ┣ 📜 App.jsx
 ┃ ┃ ┣ 📜 index.css
 ┃ ┃ ┗ 📜 main.jsx
 ┃ ┣ 📜 package.json
 ┃ ┣ 📜 package-lock.json
 ┃ ┣ 📜 .gitignore
 ┗ 📜 README.md
```

---

## 🛠️ Getting Started  

Follow these instructions to set up and run the project on your local machine.  

### ✅ Prerequisites  
Make sure you have installed:  
- [Node.js](https://nodejs.org/) (includes npm)  
- [Git](https://git-scm.com/)  
- [Supabase](https://supabase.com/) (or any PostgreSQL provider)  

---

### 🚀 Installation & Setup  

#### 1️⃣ Clone the Repository 📂  
```bash
git clone https://github.com/GitH22Ash/Allotment_Tracker
cd Allotment_Tracker
```

---

#### 2️⃣ Backend Setup ⚙️  

Navigate to the backend folder and install dependencies:  
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` and configure:  
```env
DATABASE_URL="postgres://postgres:[YOUR-PASSWORD]@db.xxxxxxxx.supabase.co:5432/postgres"
JWT_SECRET="a_very_strong_and_secret_key_that_you_should_change"
```

> ⚠️ Replace `[YOUR-PASSWORD]` with your actual database password.  
> ⚠️To generate a strong JWT secret, you can use python's `python -c "import secrets; print(secrets.token_hex(32))"` command in your terminal. 

Run database schema in Supabase SQL Editor using `db_schema.sql` present in the backend folder.  

Start the backend server:  
```bash
npm start
```

Server runs at 👉 `http://localhost:5000`  

---

#### 3️⃣ Frontend Setup 🖥️  

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at 👉 `http://localhost:5173`  

---

### 🎉 Access the Application  
Open your browser and go to **http://localhost:5173** to start using the application.  

---

## 📸 Screenshots  

### 🔐 Student Group Registration  
<img src="./assets/register_grp.png" width="600" />

### 📊 Supervisor Login  
<img src="./assets/supervisor_login.png" width="600" />

### 🎥 Admin Panel  
<img src="./assets/admin_panel.png" width="600" />

### 🎥 DB Schema  
<img src="./assets/db_er.jpg" width="600" />

---
