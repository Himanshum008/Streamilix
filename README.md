# Streamilix 🎬

Streamilix is a full-stack video streaming platform where users can watch videos and shorts, like and save content, subscribe to channels, create playlists, and manage their watch history.

Creators can manage their channels, videos, shorts, and subscribers through **Streamilix Studio**.

## 🚀 Features

* User Registration & Login
* Watch Videos
* Watch Shorts
* Upload Videos & Shorts
* Like & Save Videos/Shorts
* Subscribe to Channels
* Create Playlists
* Watch History
* Search & Filter Content
* Comments & Replies
* Creator Dashboard
* Subscriber Management
* Channel Analytics

## 🛠️ Technologies Used

### Frontend

* React.js
* Vite
* Redux
* Tailwind CSS
* Axios
* React Router

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* Cloudinary
* Multer
* Nodemailer

## 📂 Project Structure

```text
Streamilix/
│
├── frontend/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   │
│   │   ├── assets/
│   │   │
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── VideoCard.jsx
│   │   │   ├── ShortCard.jsx
│   │   │   ├── Comment.jsx
│   │   │   ├── Playlist.jsx
│   │   │   └── ...
│   │   │
│   │   ├── Pages/
│   │   │   ├── Auth/
│   │   │   ├── Channel/
│   │   │   ├── Playlist/
│   │   │   ├── Post/
│   │   │   ├── Shorts/
│   │   │   ├── Videos/
│   │   │   └── ...
│   │   │
│   │   ├── redux/
│   │   │
│   │   ├── customHooks/
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   │
│   ├── src/
│   │   │
│   │   ├── config/
│   │   │   ├── cloudinary.js
│   │   │   ├── db.js
│   │   │   └── ...
│   │   │
│   │   ├── controllers/
│   │   │   ├── user.controller.js
│   │   │   ├── video.controller.js
│   │   │   ├── short.controller.js
│   │   │   ├── channel.controller.js
│   │   │   ├── playlist.controller.js
│   │   │   └── ...
│   │   │
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js
│   │   │   ├── multer.middleware.js
│   │   │   └── ...
│   │   │
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   ├── video.model.js
│   │   │   ├── short.model.js
│   │   │   ├── channel.model.js
│   │   │   ├── playlist.model.js
│   │   │   └── ...
│   │   │
│   │   ├── routes/
│   │   │   ├── user.routes.js
│   │   │   ├── video.routes.js
│   │   │   ├── short.routes.js
│   │   │   ├── channel.routes.js
│   │   │   ├── playlist.routes.js
│   │   │   └── ...
│   │   │
│   │   └── utils/
│   │       ├── cloudinary.js
│   │       ├── token.js
│   │       └── ...
│   │
│   ├── index.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## 📌 Main Modules

### User

* Authentication
* Profile management
* Watch history
* Liked content
* Saved content

### Video

* Upload videos
* Watch videos
* Like and save
* Comments
* Views
* Search

### Shorts

* Upload shorts
* Watch shorts
* Like and save
* Comments

### Channel

* Create channel
* Manage channel
* Subscribe / unsubscribe
* Subscriber management

### Playlist

* Create playlists
* Add videos
* Remove videos
* Manage playlists

### Streamilix Studio

* Channel dashboard
* Video management
* Shorts management
* Subscriber information
* Analytics

## 👨‍💻 Author

**Himanshu Mourya**

## 📄 License

This project is created for educational and portfolio purposes.
