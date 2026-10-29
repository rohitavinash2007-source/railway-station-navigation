# Railway Station Facility Navigation & Accessibility Web System

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-success?style=for-the-badge)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![Offline First](https://img.shields.io/badge/Offline-100%25%20Independent-blue?style=for-the-badge)](#)

An interactive, responsive, and accessible digital wayfinding system designed to help railway passengers easily locate facilities, navigate platforms, and receive step-by-step walking routes. The system specifically prioritizes elderly passengers and persons with disabilities (Divyangjan) with certified step-free accessibility routing.

---

## 📌 Project Overview

Large railway stations can be overwhelming and difficult to navigate for first-time travelers, senior citizens, and passengers with disabilities. Physical signboards often lack clarity or fail to provide step-free directions.

This web application solves these challenges by providing:
- **Interactive Station Schematic Map**: An SVG-based layout of the entire station (Concourse, Foot Overbridge, Rail Tracks, and Platforms).
- **Graph-Based Shortest Path Routing**: Powered by Dijkstra’s Algorithm to generate optimal walking directions with real-world meter distances and time estimates.
- **Certified Accessibility Mode**: Automatically excludes all stairs from path calculations, routing passengers exclusively via certified ramps and elevators.
- **Text-to-Speech Voice Guidance**: Browser-native voice assistance reading out directions step-by-step for low-vision travelers.
- **Facility Discovery & Search**: Instant filtering across platforms, ticket counters, waiting halls, restrooms, medical booths, and food courts.

---

## 🛠️ Technology Stack

- **HTML5**: Semantic document structure, accessibility roles, and ARIA attributes.
- **CSS3**: Modern transit kiosk design, color-coded route indicators, high-contrast mode, and animated SVG path dash flows.
- **Vanilla JavaScript (ES6+)**: Custom graph data structure, Dijkstra’s algorithm, dynamic SVG manipulation, and browser SpeechSynthesis API.
- **No external frameworks, no backend database, no paid map APIs, and 100% offline capable.**

---

## 🚀 Key Features

### 1. Interactive SVG Station Map
- Includes all essential station facilities:
  - **Main Entrance & Exit Gate**
  - **Platform 1** (Direct level concourse access)
  - **Platforms 2 & 3** (Island platform)
  - **Ticket Counter & Booking Office**
  - **Waiting Hall & Executive Lounge**
  - **Restrooms** (Standard & Accessible Toilet)
  - **Food Court & Dining**
  - **Information & Help Desk**
  - **Lifts (Elevators)**
  - **Ramps** (Step-free incline)
  - **Foot Overbridge (FOB)**
  - **Stairs**
- Interactive pan and zoom controls (`+`, `-`, and Reset).
- Animated route path with directional flow.

### 2. Intelligent Routing Engine (Dijkstra's Algorithm)
- Station modeled as a weighted undirected graph: **20 nodes, 35 bidirectional connections**.
- Calculates accurate walking distances (meters), estimated walking duration (minutes), and step count.
- Step-by-step natural language turn guidance.

### 3. Divyangjan & Senior Accessibility Mode
- When toggled, any connection flagged with `hasStairs: true` is strictly barred from graph traversal.
- Reroutes solely through elevators and 1:12 slope ramps.
- Renders routes in high-visibility emerald green with wheelchair verification badges.

### 4. Text-to-Speech Voice Navigation
- Uses the Web Speech API (`window.speechSynthesis`) for hands-free audio announcements without needing an active internet connection.

### 5. Facility Search & Filter
- Search facilities by keyword or category: Platforms, Restrooms, Ticketing, Food, Passenger Assistance, Entrances & Exits, Accessibility Facilities.

---

## 📂 Project Structure

```text
railway-station-navigation/
│
├── index.html       # Semantic structure, SVG map canvas, and UI layout
├── styles.css       # Transit styling, high contrast theme, and animations
├── app.js           # Station graph data, Dijkstra algorithm, and map logic
└── README.md        # Project documentation and guide
```

---

## 💻 How to Run Locally

Because the project is built with pure web technologies and requires no build steps:

1. Clone or download this repository.
2. Double-click `index.html` to open it in any modern web browser (Google Chrome, Microsoft Edge, Firefox, Brave, Safari).
3. No web server or node installation is mandatory.

---

## 🌐 Live Deployment (GitHub Pages)

This project can be deployed for free on GitHub Pages:
1. Push this repository to GitHub.
2. Go to **Settings** > **Pages**.
3. Under **Branch**, select `main` (or `master`) and `/root`, then click **Save**.
4. Your site will be published at: `https://<your-username>.github.io/<repository-name>/`

---

## 🎓 Academic Viva & Technical Explanation

- **Graph Model**: $G = (V, E)$ where vertices $V$ represent facilities with $(x, y)$ SVG coordinates, and edges $E$ represent walkable corridors weighted by Euclidean/real-world distance in meters.
- **Accessibility Invariant**: In Accessibility Mode, the edge set is filtered:
  $$E_{acc} = \{ e \in E \mid e.\text{isAccessible} = \text{true} \land e.\text{hasStairs} = \text{false} \}$$
  guaranteeing that no steps appear in the computed path.
