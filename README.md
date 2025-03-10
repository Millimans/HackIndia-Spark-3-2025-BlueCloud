# Carpooling App - Backend API 🚗💨

Welcome to the Carpooling App! This backend service is built to handle user authentication, ride management, AI-based safety features, and blockchain-based payments. Below is the complete documentation for understanding what has been implemented and what remains to be done.

## Table of Contents 📌
- [Overview](#overview)
- [Implemented Features](#implemented-features)
  - [Carpooling Backend APIs](#carpooling-backend-apis)
  - [AI-Based Safety System - Alert Zone](#ai-based-safety-system---alert-zone)
  - [Blockchain Integration - Wallet Connection](#blockchain-integration---wallet-connection)
- [Pending Features](#pending-features)
  - [Web3-Based User Authentication](#web3-based-user-authentication)
  - [Blockchain-Powered Payments](#blockchain-powered-payments)
- [API Documentation](#api-documentation)
  - [Captain Management](#captain-management)
  - [Maps & Location Services](#maps--location-services)
  - [Ride Management](#ride-management)
- [Error Handling](#error-handling)
- [Conclusion](#conclusion)

## Overview 🛠️
The Carpooling App is designed to facilitate shared rides while incorporating Web3 for authentication and payments, along with AI-based safety features. The backend is built using Node.js and Express, with database support.

---

## Implemented Features ✅

### AI-Based Safety System - Alert Zone 🚨
- **Audio to Text Conversion**: Utilizes Google’s pre-trained model to convert speech to text.
- **Danger Classification**: AI model classifies if the detected text suggests the person is in danger.
- **Automated Call Alert**: If a threat is detected, an automated emergency call is placed to a trusted contact.

### Blockchain Integration - Wallet Connection 💰
- Successfully connected to Sepolia test network using MetaMask extension.

### Carpooling Backend APIs 🌍
- Ride booking and fare estimation
- Captain (driver) registration and authentication
- Location-based captain search
- Maps integration (address search, geolocation, distance estimation)

---
## Pending Features 🚧
### Web3-Based User Authentication 🔒
- Implementing blockchain-based authentication for users.
- Replacing traditional email-password login with decentralized identity verification.

### Blockchain-Powered Payments 💵
- Enabling ride payments through blockchain transactions.
- Implementing smart contracts for fare calculation and payments.
- Ensuring secure and transparent payments between users and captains.

---

## AI-Powered Emergency Detection 🚨

This feature allows users to trigger an emergency call by speaking distress keywords like **"help," "danger,"** or **"emergency."**  

### Speech Recognition & Emergency Call  
```python
import speech_recognition as sr
from twilio.rest import Client

# Emergency setup
keywords = ['help', 'danger', 'emergency']
client = Client('your_twilio_sid', 'your_twilio_auth_token')

def make_call(keyword):
    msg = f"<Response><Say voice='alice'>Emergency! {keyword.upper()} detected.</Say></Response>"
    client.calls.create(twiml=msg, to='+recipient_number', from_='+your_twilio_number')

# Voice detection
recognizer = sr.Recognizer()
with sr.Microphone() as source:
    print("🎙 Speak now...")
    try:
        text = recognizer.recognize_google(recognizer.listen(source)).lower()
        if any(k in text for k in keywords):
            make_call(next(k for k in keywords if k in text))
    except Exception:
        print("❌ Error in recognition.")
```


## Web3 Wallet Integration 🔗

To enable decentralized authentication, users can connect their MetaMask wallet and sign ride requests securely.

### Connecting MetaMask
```javascript
import { ethers } from "ethers";

export async function connectWallet() {
  if (!window.ethereum) throw new Error("MetaMask not installed");

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  
  return { address: await signer.getAddress(), signer };
}
```
**Explanation:**
- Checks if MetaMask is installed.
- Connects to the browser’s Ethereum provider.
- Retrieves the user’s wallet address and signer.
  

## API Documentation 📖

### Captain Management 🏎️
#### Register as a Captain
- **Endpoint:** `POST /captains/register`
- **Request Body:**
  ```json
  {
    "fullname": { "firstname": "Alice", "lastname": "Smith" },
    "email": "alice.smith@example.com",
    "password": "captainPass123",
    "vehicle": { "color": "Red", "plate": "XYZ-1234", "capacity": 4, "vehicleType": "car" }
  }
  ```
- **Response:** Returns captain details and authentication token.

#### Captain Login & Profile
- `POST /captains/login` - Authenticate captain.
- `GET /captains/profile` - Fetch captain details.

---

### Maps & Location Services 🗺️
#### Get Captains in a Given Radius
- **Endpoint:** `GET /maps/get-captains?lat=37.42&lng=-122.08&radius=10`
- **Response:** List of captains within the specified range.

#### Get Address Suggestions (Autocomplete)
- **Endpoint:** `GET /maps/get-suggestions?input=1600+Amphitheatre`
- **Response:** List of suggested addresses.

---

### Ride Management 🚖
#### Create a Ride
- **Endpoint:** `POST /rides/create`
- **Request Body:**
  ```json
  {
    "pickup": "Downtown, LA",
    "destination": "Hollywood, LA",
    "vehicleType": "car"
  }
  ```
- **Response:** Returns ride details including fare, status, and OTP.

#### Get Fare Estimate
- **Endpoint:** `GET /rides/get-fare?pickup=LocationA&destination=LocationB`
- **Response:** Estimated fares for different vehicle types.

---
## Error Handling ⚠️
- `400 Bad Request`: Invalid input parameters.
- `404 Not Found`: Resource unavailable.
- `500 Internal Server Error`: General server issue.

---
## Conclusion 🎯
This backend API powers a decentralized, AI-enhanced carpooling platform. We have completed core functionalities like ride booking, AI-driven safety alerts, and Web3 wallet connection. Upcoming milestones include Web3 authentication and full blockchain-based payments. 🚀

