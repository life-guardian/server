# LifeGuardian Backend

This repository contains the backend code of LifeGuardian project.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v14.17.0 or later)
- npm package manager

### Installation

1. Clone the repo
   
   `git clone https://github.com/life-guardian/server.git`

2. Navigate to projects directory
   
    `cd server`

3. Install the necessary dependencies

    `npm install`
    
4. Configuration

Before starting the server, ensure that you have set up the    necessary configuration parameters in the .env file. Take    referance from .env.example file, create .env and add the required environment variables.

5. Start the development server

    `node server.js`

..

By default, the server will run on port 5000. You can access it at http://localhost:5000.


### Run as docker container

Build the image using Dockerfile or pull the already built image from docker hub

run container by pulling image from dockerhub:
`docker run --name life-guardian-server -p 5000:5000 -e "Pass environment variables" -d pratikjpatil/life-guardian-backend:0.0.1`


## Contributing
Contributions are welcome. Please follow these steps:

1. Fork the repository

2. Create a new branch: `git checkout -b feature/your-feature`

3. Stage your changes: `git add .`

4. Commit your changes: `git commit -m 'Add your feature'`

5. Push to the branch: `git push origin feature/your-feature`

6. Open a pull request

## Contact
For questions or inquiries, please contact [Pratik Patil](mailto:pratik8560@gmail.com).

    
