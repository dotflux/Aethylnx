# Aethylnx

Aethylnx is a full-stack chat application featuring real-time messaging, group chats, user authentication, and media sharing. Built with a React + Vite frontend and an Express/MongoDB backend, it supports modern chat features and a clean, responsive UI.

![landing_page](https://github.com/dotflux/Aethylnx/blob/b6c973e443a43126b6409f1b0bc0d8d54a970219/landing_page.png)

## Features
- Real-time 1:1 and group chat (Socket.io)
- User authentication (JWT)
- Profile management (username, display name, bio, profile picture)
- Group creation, management, and avatars
- Media/file upload (Cloudinary)
- Password reset via email (Gmail/Nodemailer)
- MongoDB for scalable data storage

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, React Router, Styled Components
- **Backend:** Node.js, Express, MongoDB (Mongoose), Socket.io, Cloudinary, Nodemailer

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB database(s)
- Cloudinary account
- Gmail account (for email/password reset)

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/dotflux/aethylnx.git
   cd aethylnx
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Configure environment variables:**
   - Create a `.env` file in the root or backend directory with the following:
     ```env
     SECRET_KEY=your_jwt_secret_key
     CLOUDINARY_NAME=your_cloudinary_cloud_name
     CLOUDINARY_API_KEY=your_cloudinary_api_key
     CLOUDINARY_API_SECRET=your_cloudinary_api_secret
     CONNEC_STR_USR=your_mongodb_user_connection_string
     CONNEC_STR_DUMUSR=your_mongodb_dummyuser_connection_string
     CONNEC_STR_CONV=your_mongodb_conversation_connection_string
     GMAIL=your_gmail_address@gmail.com
     GMAIL_PASS=your_gmail_password_or_app_password
     ```

### Running the App

#### Backend (API + Socket.io)
```bash
npm run server
```
- Runs on [http://localhost:3000](http://localhost:3000) by default.

#### Frontend (React)
```bash
npm run dev
```
- Runs on [http://localhost:5173](http://localhost:5173) by default.

### Build for Production
```bash
npm run build
```

## SignUp

User can create their accounts here to venture into Aethylnx.

![signup_page](https://github.com/dotflux/Aethylnx/blob/b6c973e443a43126b6409f1b0bc0d8d54a970219/signup.png)

## Profile

This is how the user's profile look like to himself.

![profile_modal](https://github.com/dotflux/Aethylnx/blob/b6c973e443a43126b6409f1b0bc0d8d54a970219/profile.png)

## Chat

A demo of how the chat looks like in Aethylnx.

![chat_page](https://github.com/dotflux/Aethylnx/blob/b6c973e443a43126b6409f1b0bc0d8d54a970219/chat.png)

## Folder Structure
- `backend/` — Express API, Socket.io, MongoDB models, business logic
- `src/` — React components, pages, assets, styles
- `public/` — Static assets

## License
MIT

---
