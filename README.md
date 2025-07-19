# 🍽️ FoodEx Backend

A Node.js backend API for a recipe sharing and food community platform. Built with Express.js and file-based database for easy demo and development.

## 📁 Project Structure

```
foodex-mern/
├── backend/                  # Node.js Backend
│   ├── app.js               # Main application entry point
│   ├── package.json         # Dependencies and scripts
│   ├── controllers/         # Route controllers
│   │   ├── auth.js         # Authentication logic
│   │   ├── recipes.js      # Recipe management
│   │   └── user.js         # User management
│   ├── routes/             # API routes
│   │   ├── auth.js         # Authentication routes
│   │   ├── recipes.js      # Recipe routes
│   │   └── user.js         # User routes
│   ├── middleware/         # Custom middleware
│   │   └── authguard.js    # JWT authentication guard
│   ├── models/             # Data models
│   ├── utils/              # Utility functions
│   │   ├── fileDB.js       # File-based database utility
│   │   ├── email.js        # Email sending utilities
│   │   └── suggestionmail.js # Suggestion email templates
│   ├── data/               # JSON data files
│   │   ├── users.json      # User data storage
│   │   └── recipes.json    # Recipe data storage
│   └── uploads/            # File upload directory
├── package.json            # Root package.json
└── README.md              # This file
```

## 📚 API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `POST /auth/google` - Google OAuth login
- `POST /auth/check-otp` - OTP verification
- `POST /auth/resend-otp` - Resend OTP
- `POST /auth/send-reset-otp` - Send password reset OTP
- `POST /auth/check-reset-otp` - Verify reset OTP
- `POST /auth/reset-password` - Reset password

### Recipes
- `GET /recipe` - Get all recipes
- `POST /recipe/add` - Create new recipe
- `GET /recipe/:id` - Get specific recipe
- `GET /recipe/category/:type` - Get recipes by category
- `PUT /recipe/edit` - Edit recipe
- `DELETE /recipe/:id/:ownerId` - Delete recipe
- `GET /recipe/read/:id/:readerId` - Read recipe with user context
- `GET /recipe/guest/:id` - Read recipe as guest
- `POST /recipe/like` - Like/unlike recipe
- `POST /recipe/suggestion` - Send recipe suggestion
- `GET /recipe/search` - Search recipes

### Users
- `GET /user/profile/:userId` - Get user profile
- `GET /user/bookmarks/:userId` - Get user bookmarks
- `GET /user/other/:celebId/:fanId` - Get other user profile
- `PUT /user/profile-picture/:userId` - Update profile picture
- `GET /user/following/:userId` - Get following list
- `GET /user/followers/:userId` - Get followers list
- `POST /user/follow-toggle` - Follow/unfollow user
- `PUT /user/preferences` - Update user preferences
