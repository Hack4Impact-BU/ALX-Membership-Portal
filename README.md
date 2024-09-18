# Membership-Portal

## How to set-up this project so that both next.js and rails are working properly

1. Install Next.js and Rails (including bundler, watch tutorial about how to do this because it can be complicated)
2. Install Docker 
3. git clone this repository
4. cd into the repository
5. run "docker-compose up --build"
6. To Access the application:
- Frontend: Open http://localhost:3000 in your browser.
- Backend: Rails API is typically running on http://localhost:3001.

To stop the application:
	•	run "docker-compose down"



## How to start making your own feature branches

1. If you haven't already, install git flow onto your computer
2. Once installed, go into the repository in the CLI and type "git flow init"
3. All the default settings should already be there so just keep hitting enter: (make sure production is for main, and development is for develop)
4. Make your first branch by typing out: "git flow feature start feature_branch_name"
5. If at any time your branch is behind develop, use the comamnd "git merge develop"
   
