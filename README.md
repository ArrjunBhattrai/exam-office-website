Here's a **README.md** file for setting up and starting your **Exam Office Website** project:

---

### **Exam Office Website**

A full-stack web application with a **frontend (Vite + React)** and **backend (Node.js + Express.js)**.

---

## 🚀 **Getting Started**

### **1. Clone the Repository**

```sh
git clone https://github.com/Dipesh1203/exam_office_backend.git
cd exam_office_backend
```

### **2. Install Dependencies**

Run the following command to install dependencies for both frontend and backend:

```sh
npm install
cd frontend && npm install
cd ../backend && npm install
cd ..
```

### **3. Setup Environment Variables**

Create a `.env` file inside the `backend` and `frontend` directories and configure them properly.

#### **Backend `.env` Example**

```env
PORT=5000
DATABASE_URL=mongodb://localhost:27017/exam_office
JWT_SECRET=your_secret_key
```

#### **Frontend `.env` Example**

```env
VITE_API_BASE_URL=${BACKEND_URL}
```

### **4. Start the Application**

To start both the frontend and backend simultaneously, run:

```sh
npm run start
```

> This uses `concurrently` to run both parts together.

### **5. Running Frontend and Backend Separately**

If needed, you can run them separately:

#### **Start Backend**

```sh
cd backend
npm run start
```

#### **Start Frontend**

```sh
cd frontend
npm run dev
```

---

## 🛠 **Available Scripts**

| Command                       | Description                               |
| ----------------------------- | ----------------------------------------- |
| `npm run start`               | Starts both frontend and backend together |
| `cd frontend && npm run dev`  | Starts the frontend in development mode   |
| `cd backend && npm run start` | Starts the backend server                 |
| `npm run build`               | Builds the frontend for production        |
| `npm run test`                | Placeholder for test scripts              |

---

## 📂 **Project Structure**

```
exam_office_backend/
│── backend/        # Node.js & Express backend
│── frontend/       # Vite + React frontend
│── package.json    # Project configuration
│── README.md       # Documentation
```

---

## 📞 **Support**

For any issues, open a ticket [here](https://github.com/Dipesh1203/exam_office_backend/issues).

---

This README should help others set up and start the project easily. Let me know if you want any modifications! 🚀
