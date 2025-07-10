# URL Shortener REST API

This project is a Node.js + Express REST API that creates short URLs and stores them in MongoDB. It is deployed on Render.

## ✨ Features

- Create a shortened URL for any valid long URL.
- Redirect to the original URL when accessing the short link.
- Stores data in MongoDB Atlas.
- API tested using Postman.

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- Postman
- Render (Deployment)

---

##  Getting Started Locally

Follow these steps to set up the project on your local machine.

### 1️⃣ Clone the repository

```bash
  
git clone https://github.com/Bishwajeetsingh7232/url_shortner


2️⃣ Install dependencies
cd your-repo-name
npm install


3️⃣ Set up environment variables
Create a .env file in the root directory and add your MongoDB connection string:

MONGO_URI= mongodb://localhost:27017/urlshort 
PORT=3000

4️⃣ Start the server
npm start

The server should now be running at:
http://localhost:3000

📬 API Endpoints
Create Short URL

POST /shorten
POST : https://url-shortner-roik.onrender.com
       https://url-shortner-roik.onrender.com/shorten

Body (JSON):

json
{
  "url": "https://www.google.com"
}

Response:
{
    "shortUrl": "https://url-shortner-roik.onrender.com/-U_69d5Q5"
}

Redirect Short URL
GET /:code
example /-U_69d5Q5
When you open the short URL in your browser, it will redirect to the original long URL.



# Testing with Postman
Import the included Postman collection (postman_collection.json) or manually create requests.

Test the endpoints:

POST /shorten to create a short URL.

GET /<shortCode> to verify the redirect.


# Deployment
This API is deployed on Render:

 Production URL Base: https://url-shortner-roik.onrender.com
Final URL for testing: https://url-shortner-roik.onrender.com/shorten

You can test it using Postman.
