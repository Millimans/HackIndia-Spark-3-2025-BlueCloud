# CARPOOL

# Backend API Documentation

## `/users/register` Endpoint

### **Description**

Registers a new user by creating a user account with the provided information.

### **HTTP Method**

`POST`

### **Request Body**

The request body should be in JSON format and include the following fields:

- **`fullname` (object)**:
  - `firstname` (string, required): User's first name (minimum 3 characters).
  - `lastname` (string, optional): User's last name (minimum 3 characters).
- **`email` (string, required)**: User's email address (must be valid).
- **`password` (string, required)**: User's password (minimum 6 characters).

### **Validation Rules**

- `email` must be valid.
- `fullname.firstname` must have a minimum length of 3 characters.
- `password` must be at least 6 characters.

### **Example Request**

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

### **Example Response**

**201 Created**

```json
{
  "token": "JWT_Token_String",
  "user": {
    "_id": "userId123",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

**400 Bad Request**

```json
{
  "errors": [
    {
      "msg": "First name must be at least 3 characters long",
      "param": "fullname.firstname"
    }
  ]
}
```

---

## `/users/login` Endpoint

### **Description**

Authenticates a user using their email and password, returning a JWT token upon successful login.

### **HTTP Method**

`POST`

### **Request Body**

The request body should be in JSON format and include the following fields:

- **`email` (string, required)**: User's email address (must be valid).
- **`password` (string, required)**: User's password (minimum 6 characters).

### **Validation Rules**

- `email` must be valid.
- `password` must be at least 6 characters.

### **Example Request**

```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

### **Example Response**

**200 OK**

```json
{
  "token": "JWT_Token_String",
  "user": {
    "_id": "userId123",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com"
  }
}
```

**401 Unauthorized**

```json
{
  "message": "Invalid email or password"
}
```

**400 Bad Request**

```json
{
  "errors": [
    {
      "msg": "Invalid Email",
      "param": "email"
    }
  ]
}
```

---

## Endpoint: `/user/profile`

### Description:

The `/user/profile` endpoint is used to retrieve the profile information of an authenticated user. It returns the details of the user associated with the provided authentication token.

### Method:

`GET`

### URL:

`http://localhost:4000/users/profile`

### Authentication:

This endpoint requires a valid **JWT token** in the request's **Authorization header** to access the user's profile.

### Request Headers:

- `Authorization: Bearer <JWT_Token>`
  - **<JWT_Token>**: The JWT token issued after a successful login or registration.

### Request Example:

```bash
curl -X GET http://localhost:4000/users/profile \
  -H "Authorization: Bearer <your_token>"
```

### Response:

#### Success (HTTP 200):

On success, the endpoint will return the user's profile data.

##### Response Body:

```json
{
  "_id": "647acaf66d67a829e1281e8e",
  "firstname": "John",
  "lastname": "Doe",
  "email": "john.doe@example.com",
  "createdAt": "2024-11-30T09:20:00Z",
  "updatedAt": "2024-11-30T09:20:00Z"
}
```

#### Failure (HTTP 401 - Unauthorized):

If the token is missing, invalid, or expired, the request will be rejected with an authentication error.

##### Response Body:

```json
{
  "message": "Unauthorized: Token missing"
}
```

or

```json
{
  "message": "Invalid or expired token"
}
```

#### Failure (HTTP 404 - User Not Found):

If the user corresponding to the decoded token does not exist in the database, a `404 Not Found` response is returned.

##### Response Body:

```json
{
  "message": "User not found"
}
```

### Example Response:

#### Success (HTTP 200):

```json
{
  "_id": "647acaf66d67a829e1281e8e",
  "firstname": "John",
  "lastname": "Doe",
  "email": "john.doe@example.com",
  "createdAt": "2024-11-30T09:20:00Z",
  "updatedAt": "2024-11-30T09:20:00Z"
}
```

### Error Responses:

- **401 Unauthorized:**

  - `message: "Unauthorized: Token missing"` - When no token is provided.
  - `message: "Invalid or expired token"` - When the provided token is invalid or expired.

- **404 Not Found:**
  - `message: "User not found"` - When the user associated with the decoded token does not exist in the database.

---

### Notes:

- The `Authorization` header should be included with the **Bearer** keyword followed by the JWT token.
- Ensure that the JWT token used is valid and has not expired. Tokens are typically issued during the login or registration process and must be included in requests to access protected routes.
- The token is typically stored in a secure cookie or local storage in client applications (like Postman, front-end apps, etc.).

---

## `/users/logout` Endpoint

### **Description**

Logs out the currently authenticated user by clearing the authentication token and blacklisting it.

---

### **HTTP Method**

`GET`

---

### **Authentication**

Requires a valid JWT token provided in either:

- **Cookies**: `token=<JWT_Token>`
- **Authorization Header**: `Authorization: Bearer <JWT_Token>`

---

### **Example Request**

```http
GET /users/logout
Authorization: Bearer <JWT_Token>
```

---

### **Example Response**

**200 OK**

```json
{
  "message": "Logged Out"
}
```

**401 Unauthorized** (No token provided)

```json
{
  "message": "Unauthorized: Token missing"
}
```

**401 Unauthorized** (Blacklisted token)

```json
{
  "message": "Unauthorized: Token blacklisted"
}
```

**401 Unauthorized** (Invalid/expired token)

```json
{
  "message": "Invalid or expired token"
}
```

---

### **Behavior**

- Clears the token from cookies.
- Extracts the token from cookies or the `Authorization` header.
- Adds the token to the blacklist database to prevent reuse.
- Returns a success message upon logout.
