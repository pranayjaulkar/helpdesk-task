# Setup Guide & Project Details



## Features

Users can register, log in, create tickets, see their own tickets and their status, edit or delete a ticket while it is still open, and comment on their tickets.

Admins can see all tickets, filter them by status and priority, change status and priority, reply to any ticket and delete tickets.

Both get notifications for activity on their tickets, and every ticket has an activity log.



## Tech used

- Backend: Node.js(v22), Express, MongoDB with Mongoose
- Auth: JWT and bcryptjs
- Validation: Zod
- Frontend: React with Vite, React Router, Zustand, Axios and Tailwind CSS



## Folder structure

The project has two folders. `server` is the Express API and `client` is the React app.

Inside `server/src` the code is split into config, models, validators, middleware, controllers, services, events, routes, utils and scripts.




## Setup

You need Node.js 22 or newer and MongoDB running locally (or a MongoDB Atlas URL).

Backend Setup Steps:

- cd server
- npm install
- cp .env.example .env
- npm run dev


The `.env` file needs following env variables
- PORT
- MONGO_URI
- JWT_SECRET
- JWT_EXPIRES_IN (format: '_number_d', example 1d for one day)
- CLIENT_URL (the frontend URL, used for CORS).

Registering always creates a normal user. To create an admin run:

npm run create-admin -- "Admin" admin@example.com Admin1234


If the email already exists, that user is made an admin.

Frontend Setup Steps:

- cd client
- npm install
- npm run dev


The frontend runs on http://localhost:5173. Set `VITE_API_URL` to the {API URL}+/api.




## Implementation decisions

- Validation is done with Zod schemas before the request reaches a controller.
- anything that isn't about the main action like logging and notifications is handled through events.
- The admin user can be created only through running the create admin script on the server.
- Role checks are done with an `authorize` middleware. 
- Ownership is checked when the ticket is accessed. If a user asks for a ticket that isn't theirs they get a 404 instead of a 403.
- Users can only edit or delete a ticket while it is open. Once support starts working on it, only admins can change it. Status and priority changes are admin only. Comments are not allowed on closed tickets.
- For events I used Node's built-in EventEmitter. Controllers emit an event after the main action (ticket created, updated, status changed, priority changed, resolved, comment added) and listeners write the activity log and create notifications. The listeners catch their own errors, so a failed notification doesn't fail the request.
- Errors are thrown as `AppError` with a status code and handled in one error middleware, so every error response looks the same and it makes API error logging easier. 
- Passwords are hashed with bcrypt and never returned in responses. 
- Implemented helmet is used for security headers.
- On the frontend, Zustand stores the auth state (saved in localStorage), tickets and notifications. 
- An Axios interceptor adds the token to every request and logs the user out if the API returns 401.




## API
All routes start with `/api`. Protected routes need an `Authorization: Bearer <token>` header.




### Auth

POST /auth/register - create an account. Body: name, email, password (at least 8 characters with a letter and a number). Returns the user and a token.

POST /auth/login - log in. Body: email, password. Returns the user and a token.

GET /auth/me - get the logged in user.




### Tickets

GET /tickets - users get their own tickets, admins get all tickets

POST /tickets - create a ticket (for users only).

GET /tickets/:id - get a ticket with its comments.

PATCH /tickets/:id - edit ticket details (users can edit only, while the ticket is open).

DELETE /tickets/:id - delete a ticket

PATCH /tickets/:id/status - change status (for admins only)

PATCH /tickets/:id/priority - change priority (admin only)

GET /tickets/:id/activity - activity log of the ticket




### Comments

GET /tickets/:id/comments - list comments of a ticket.

POST /tickets/:id/comments - add a comment.



### Notifications

GET /notifications - your notifications, newest first

PATCH /notifications/:id/read - mark one notification as read.

PATCH /notifications/read-all - mark all as read.






## Database design

I used MongoDB and created five collections: users, tickets, comments, activitylogs and notifications. Comments, logs and notifications are kept in separate collections instead of inside the ticket document, so tickets don't keep growing and each can be queried on its own.


users
- _id: ObjectId (Primary Key)
- name: String (Required)
- email: String (Required, Unique)
- password: String (Required, Hashed, excluded by default)
- role: String (Enum: "user", "admin" | Default: "user")
- createdAt: Date (Auto-generated)
- updatedAt: Date (Auto-generated)
- Indexes: email (Unique)

tickets
- _id: ObjectId (Primary Key)
- title: String (Required)
- description: String (Required)
- category: String (Required)
- priority: String (Enum: "low", "medium", "high", "urgent" | Default: "medium")
- status: String (Enum: "open", "in_progress", "resolved", "closed" | Default: "open")
- createdBy: ObjectId (Ref: users, Required)
- resolvedAt: Date (Nullable, Default: null)
- createdAt: Date (Auto-generated)
- updatedAt: Date (Auto-generated)
- Indexes: createdBy + createdAt (Compound), status + priority (Compound)

comments
- _id: ObjectId (Primary Key)
- ticket: ObjectId (Ref: tickets, Required)
- author: ObjectId (Ref: users, Required)
- message: String (Required)
- createdAt: Date (Auto-generated)
- updatedAt: Date (Auto-generated)
- Indexes: ticket

activitylogs
- _id: ObjectId (Primary Key)
- ticket: ObjectId (Ref: tickets, Required)
- actor: ObjectId (Ref: users, Required)
- action: String (Required, e.g., "ticket.status_changed")
- meta: Object (Event details, e.g., old and new status)
- createdAt: Date (Auto-generated)
- Indexes: ticket

notifications
- _id: ObjectId (Primary Key)
- recipient: ObjectId (Ref: users, Required)
- ticket: ObjectId (Ref: tickets, Required)
- type: String (Required)
- message: String (Required)
- read: Boolean (Default: false)
- createdAt: Date (Auto-generated)
- Indexes: recipient + read + createdAt (Compound)

### Relations
- A user has many tickets
- A ticket has many comments and activity logs
- A user has many notifications. 

All collections have createdAt and updatedAt timestamps.

### Notification Generation
- When a ticket is created, all admins get a notification. 
- When an admin changes the status or priority, resolves the ticket or replies, the ticket owner gets a notification. 
- When the owner comments, admins get a notification. 
- All of these are also written to the activity log.
