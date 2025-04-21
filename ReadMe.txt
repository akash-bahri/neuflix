# 🎬 NEUFLIX – Movie Recommendation System

NEUFLIX is a Netflix-inspired movie recommendation web app built using **React (frontend)** and **Flask (backend)**. It combines multiple recommendation algorithms including collaborative filtering and graph-based hybrid techniques to deliver personalized suggestions.

---

## 🚀 Features

- 🔐 **Simple Login** – just enter your User ID to get started
- 🏠 **Netflix-style Home Page** – rotating spotlight banner + genre rows
- 🎯 **Multiple Recommendation Algorithms**
  - Item-Item Collaborative Filtering
  - Cluster-based Graph Hybrid Recommender (GHRS)
  - Popularity-based, Random, and Content-based options
- ⭐ **Rate Movies** – and get smarter recs
- 🎥 **Movie Modals** – hover to view poster, rating, and IMDb link
- 📝 **My List** – see everything you’ve rated

---

## 🖼 Screenshots

### 🔐 Login Page
![Login](/screenshots/Picture1.png)

### 🏠 Home Page
![Home](/screenshots/Picture2.png)

### 🎯 Recommendation Results
![Recommendations](/screenshots/Picture3.png)

### 📂 Genre Listings
![Genres](/screenshots/Picture4.png)

### 🎬 Movie Hover Modal
![Modal](/screenshots/Picture5.png)

### 🌟 Rating a Movie
![Rating](/screenshots/Picture6.png)

### 📑 My List
![My List](/screenshots/Picture7.png)

---

## 🛠 Tech Stack

**Frontend:**
- React + Vite
- MUI (Material UI)
- Axios

**Backend:**
- Flask
- Pandas, NumPy
- TensorFlow / Keras (for GHRS)
- Scikit-learn
- TMDB API for movie metadata

**Data:**
- MovieLens Dataset

---

## 🧪 Run the App Locally

### 1. Frontend

```bash
cd Application
npm install
npm start
