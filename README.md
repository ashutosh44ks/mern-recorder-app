# mern-recorder-app
 
## Features
1. Login System using JWt token
2. Record Screen and Webcam
3. Live Preview
4. Download ability

## Tech stack
MERN (MongoDB + Express.js + React JS + Node.js)
Used react-media-recorder-2 for implementing Recording systems

## How to run
1. Install node modules in root and root>client dir
2. Create ```.env``` file in root containing the following key-value pairs - 
 - ```ACCESS_TOKEN_SECRET = <your-secret>```
 - ```REFRESH_TOKEN_SECRET = <your-secret>```
 - ```DATABASE_URL = mongodb://127.0.0.1:27017/mern-recorder-app```
3. Run command ```npm run dev``` to start both server and client concurrently
