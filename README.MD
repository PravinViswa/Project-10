# 2048 Game Project

This project is a web based implementation of the 2048 game. I have built it with React frontend and a Rust backend and AWS DynamoDB for cloud storage.

## Features

- **Guest Mode**: Play the game without logging in.
- **Player Mode**: Log in with a player ID to save and load your game state from anywehre.

## Prerequisites

- Docker and Docker Compose
- AWS Account with DynamoDB access
- Rust and Cargo
- Node.js and npm

## To Run

1.  **Clone the repository.**
2.  **Configure Environment Variables**:
    -   Fill in AWS credentials and DynamoDB table name.
3.  **Run with Docker Compose**:
    ```bash
    docker-compose up --build
    ```
4.  Open browser and navigate to `http://localhost:3000`.