# Create a User Management System

Project Highlights

There are 3 type of users.
<br>1. SUPERADMIN
<br>2. ADMIN
<br>3. USER

SUPERADMIN can create both type of users, update verification_status and also can manage role as well.
<br>ADMIN can create users and only manage status not verification_status.
<br>USER can login and check their own status.
<br>For Authentication JWT mechanism used.
<br>For securely store password bcrypt library used.

These are following routes.

post /users - for user creation
<br>post /users/login - for user login
<br>get /users/status - for get user's status
<br>get /users - for get all users 
<br>get /users/:userId - for get particular user
<br>put /users/:userId - for update particular user
<br>delete /users/:userId - for delete particular user

## Prerequisite
MongoDB should be installed on your device.

## Installation

<br>1. Clone the repository : "git clone https://github.com/gk2810/user-management-system.git"
<br>2. Install Dependency with npm
```bash
  npm install
```
<br>3. Create .env file from .env.examplefile
<br> - you need to create cluster db url in .env file not local db url
<br>4. Run Project
```bash
  node index.js
```