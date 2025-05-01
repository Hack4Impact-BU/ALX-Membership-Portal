# Membership-Portal

## Project Overview

This application is a comprehensive community platform designed to connect users with local opportunities including jobs, events, and special offers from businesses. The platform serves as a central hub for community engagement, professional networking, and resource sharing.

## Features

- **Job Board**: Browse and save job listings from local employers
- **Events Calendar**: Discover and save community events, workshops, and gatherings
- **Special Offers**: Access exclusive deals and promotions from local businesses
- **Get Involved**: Find volunteer opportunities and ways to contribute to the community
- **User Profiles**: Manage personal information and track saved items
- **Responsive Design**: Fully functional on both desktop and mobile devices

## Tech Stack

### Frontend
- **Framework**: Next.js (React)
- **Styling**: Tailwind CSS
- **Authentication**: JWT token-based auth
- **State Management**: React hooks and context

### Backend
- **Framework**: Ruby on Rails
- **Database**: PostgreSQL
- **API**: RESTful JSON API
- **Authentication**: JWT tokens

## How to set-up this project (Docker Method)

1. Install Next.js and Rails (including bundler, watch tutorial about how to do this because it can be complicated)
2. Install Docker 
3. git clone this repository
4. cd into the repository
5. Create the necessary `.env` files (see Environment Variables section below)
6. run "docker-compose up --build"
7. To Access the application:
   - Frontend: Open http://localhost:3000 in your browser.
   - Backend: Rails API is typically running on http://localhost:3001.

To stop the application:
- run "docker-compose down"

## Alternative Setup (Non-Docker)

### Backend Setup

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. Install backend dependencies
   ```bash
   cd backend
   bundle install
   ```

3. Set up the database
   ```bash
   rails db:create
   rails db:migrate
   rails db:seed
   ```

4. Create a `.env` file in the backend directory (see Environment Variables section)

5. Start the Rails server
   ```bash
   rails server -p 3001
   ```

### Frontend Setup

1. Navigate to the frontend directory
   ```bash
   cd ../frontend
   ```

2. Install frontend dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the frontend directory (see Environment Variables section)

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Visit `http://localhost:3000` in your browser

## Environment Variables

### Backend (.env file in backend directory)

```
DATABASE_URL=postgresql://postgres:postgres@db:5432/membership_portal_development
JWT_SECRET=your_jwt_secret_key
RAILS_ENV=development
PORT=3001
POSTGRES_PASSWORD=postgres
POSTGRES_USER=postgres
POSTGRES_DB=membership_portal_development
```

### Frontend (.env.local file in frontend directory)

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_NAME=name
NEXT_PUBLIC_EMAIL=email
NEXT_PUBLIC_NUMBER=phone_number
```

## Test Credentials

For testing purposes, you can use these credentials:
- Email: test@example.com
- Password: password123

Or register a new account through the application's sign-up page.

## Deployment

### Backend Deployment (Render)
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `bundle install`
4. Set start command: `bundle exec rails server -p $PORT`
5. Add environment variables in the Render dashboard:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: Secret key for JWT tokens
   - `RAILS_ENV`: production
   - Other environment variables as needed
6. Deploy

### Frontend Deployment
1. Build the frontend application
   ```bash
   npm run build
   # or
   yarn build
   ```
2. Deploy the `frontend/.next` directory to your hosting service of choice (Vercel, Netlify, or Render)
3. Ensure environment variables are properly set in your deployment platform

## How to start making your own feature branches

1. If you haven't already, install git flow onto your computer
2. Once installed, go into the repository in the CLI and type "git flow init"
3. All the default settings should already be there so just keep hitting enter: (make sure production is for main, and development is for develop)
4. Make your first branch by typing out: "git flow feature start feature_branch_name"
5. If at any time your branch is behind develop, use the command "git merge develop"

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Troubleshooting

- **Backend API not responding**: Ensure PostgreSQL is running and accessible
- **Authentication issues**: Check JWT token generation in the backend
- **Frontend styling issues**: Make sure Tailwind CSS is properly configured
- **Docker problems**: Check logs with `docker-compose logs`
