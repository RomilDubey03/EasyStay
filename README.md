# EasyStay - End to End Major Project

**EasyStay** is a stay booking website built using the MVC design pattern to help users easily find and book accommodations at different locations.

## 🚀 Tech Stack

- **Frontend**: Bootstrap, JavaScript, Vanilla CSS  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB  
- **Image Hosting**: Cloudinary  
- **Authentication**: Passport.js

## ✨ Features

- User Authentication & Authorization (via Passport.js)
- Stay Listings with Images and Details
- Review and Rating System
- Interactive Map Integration for Location Display
- Cloud Storage for Image Uploads

## 📸 Project Screenshots

<p align="center">
  <img src="./public/assets/Screenshot (113).png" alt="Listings Page" width="600"/>
  <br><em>📍 Stay Listings</em>
</p>

<h3 align="center">🔐 Register & Login Screens</h3>

<p align="center">
  <img src="./public/assets/Screenshot (120).png" alt="Register Page" width="45%" style="margin-right:10px;"/>
  <img src="./public/assets/Screenshot (116).png" alt="Login Page" width="45%"/>
</p>

<p align="center">
  <img src="./public/assets/Screenshot (114).png" alt="Stay Detail Page" width="600"/>
  <img src="./public/assets/Screenshot (117).png" alt="Stay Detail Page" width="600"/>
  <img src="./public/assets/Screenshot (115).png" alt="Stay Detail Page" width="600"/>
  <br><em>🛏️ Stay Detail Page</em>
</p>

## 🔧 Installation

To run the project locally:

```bash
# Clone the repository
git clone https://github.com/your-username/easystay.git
cd easystay

# Install dependencies
npm install

# Create a .env file and add the following variables
# Example:
# DB_URL=mongodb://localhost:27017/easystay
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_KEY=your_key
# CLOUDINARY_SECRET=your_secret
# SECRET=session_secret_key

# Run the server
npm start
```

Make sure MongoDB is running locally or provide a MongoDB Atlas URL.

## 💡 Usage

Once the server is running, navigate to:

```
http://localhost:3000
```

From there, you can register, login, browse listings, write reviews, and book stays.

## 👤 Author

**Romil Dubey**  
GitHub: [@your-github](https://github.com/RomilDubey03)  
Email: romildubey03@gmail.com

## 📄 License

This project is open-source.
