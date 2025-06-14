# Been There - An Interactive Travel Map

An interactive, full-stack web application that allows users to track the countries they've visited, maintain a travel bucket list, and connect with friends to see their travel maps. The project is built with D3.js for data visualization and is fully integrated with Google Firebase for backend services, including authentication, database, and hosting.

**[Live Demo](https://been-app-clone.web.app/)** <!-- Replace with your Firebase hosting link! -->

---

![Screenshot 2025-06-05 at 19-46-55 Been There - Visited Countries Map](https://github.com/user-attachments/assets/e8e6bbcf-6360-4f64-8d6a-f05ad10a2d41)

## ✨ Features

*   **Interactive World Map:** A zoomable, pannable world map rendered with **D3.js** and **TopoJSON**.
*   **User Authentication:** Secure sign-in with Google via **Firebase Authentication**.
*   **Real-time Database:** User data is stored and synced with **Cloud Firestore**, allowing for a seamless experience across devices.
*   **Visited Countries & Bucket List:**
    *   ✅ Click any country to mark it as "Visited" or add it to your "Bucket List".
    *   ✅ The map color-codes your selections for easy visualization.
    *   ✅ Track the number of times you've visited each country.
*   **Social Connections:**
    *   ✅ Search for other users by their unique username.
    *   ✅ Send, receive, and accept friend requests.
    *   ✅ View the travel maps of your friends.
*   **Data Dashboards:**
    *   📊 **My Stats:** View personal statistics, including the percentage of the world explored, total visits, and your most-visited country.
    *   🏆 **Leaderboard:** See how you rank against your friends based on the number of countries visited.
*   **Responsive & Modern UI:** The interface is built with **Tailwind CSS**, ensuring it is clean, modern, and works across different screen sizes.

## 🛠️ Tech Stack

*   **Frontend:** HTML5, CSS3, JavaScript (ES6+)
*   **Styling:** **Tailwind CSS**
*   **Data Visualization:** **D3.js** & **TopoJSON**
*   **Backend Services:** **Google Firebase**
    *   **Firebase Hosting:** For deploying and serving the web application.
    *   **Firebase Authentication:** For Google Sign-In.
    *   **Firestore Database:** A NoSQL database for storing all user and application data.
*   **Map Data:** The `map.json` TopoJSON data is based on the [Natural Earth](https://www.naturalearthdata.com/) dataset.

## 📂 File Structure

This project is configured for deployment with Firebase Hosting. All public-facing assets reside in the `public` directory.

```
.
├── public/
│   ├── index.html         # The main HTML structure
│   ├── style.css          # Custom styling rules
│   ├── script.js          # All application logic
│   └── map.json           # TopoJSON data for the world map
├── .gitignore
├── firebase.json          # Firebase hosting and project configuration
├── firestore.indexes.json # Firestore database index definitions
├── firestore.rules        # Security rules for the Firestore database
└── README.md              # This file
```


## 🚀 Running This Project Locally

To get a local copy up and running, follow these steps.

### Prerequisites

*   **Node.js** and **npm** installed on your machine.
*   **Firebase CLI** installed globally:
    ```sh
    npm install -g firebase-tools
    ```

### Installation & Setup

1.  **Clone the Repository**
    ```sh
    git clone https://github.com/omerjakoby/Been-App-Clone.git
    cd Been-App-Clone
    ```

2.  **Set Up Your Own Firebase Project**
    *   Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
    *   Enable **Google** as a sign-in provider in the **Authentication** section.
    *   Create a **Firestore Database** in test mode.
    *   From your project settings, get your web app's `firebaseConfig` object.

3.  **Configure the Project**
    *   Open `public/script.js` and replace the placeholder `firebaseConfig` object with your own.
    *   In your terminal, connect the local project to your Firebase account:
        ```sh
        firebase login
        firebase use --add
        ```
        Then, select the Firebase project you just created.

4.  **Run the Local Development Server**
    *   Use the Firebase emulator suite to run the app locally.
    *   ```sh
        firebase serve
        ```
    *   Open your browser to `http://localhost:5000`.

## 🚢 Deployment

To deploy the application to Firebase Hosting, run the following command from the root of the project:

```sh
firebase deploy
```
