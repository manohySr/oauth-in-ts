## 🌐 Why Use OAuth Instead of Standard Auth (Login with Email and Password)? 🤔

######  🔒 Enhanced Security
OAuth provides a higher level of security by allowing users to log in without sharing their passwords with third-party applications.


######  🔄 Single Sign-On (SSO)
OAuth enables SSO, letting users log in once and access multiple services without needing to authenticate again.


######  🌍 Universal Integration
OAuth allows seamless integration with various popular services (like Google, Facebook, etc.), improving user experience.


## 🛠️ Why Use Pre-Developed Systems Instead of Developing My Own? 🚀

###### ⏱️ Save Time and Effort
Using pre-developed systems saves a significant amount of development time and effort, allowing you to focus on core features.


###### 🔧 Reliability and Security
Pre-developed systems are usually well-tested and maintained, ensuring reliability and security in your application.


###### 📈 Scalability
These systems are designed to handle scalability issues, providing a solid foundation for your application as it grows.



## 🌟 Google OAuth

![OAuth Flow Image](https://github.com/manohySr/oauth-in-ts/assets/86122918/49d5790c-6619-42d5-8f95-ca20a4e2cd53)
Description of the OAuth Flow Image (Server-side Authorization Code Flow)

###### 🧑‍💻 Resource Owner: User

###### 🌐 Client: web.app.com

###### 🖥️ Resource Server: api.app.com

###### 🔑 Authorization Server: accounts.google.com

Google OAuth is an implementation of the OAuth 2.0 protocol which allows users to securely log in to your application using their Google account.

- **Step 1**: The user clicks the "Login with Google" button on your application.
  
- **Step 2**: The user is redirected to the Google login page to enter their credentials.

- **Step 3**: Upon successful login, Google redirects the user back to your application with an authorization code.

- **Step 4**: Your application exchanges the authorization code for an access token by making a request to Google's token endpoint.

- **Step 5**: The access token can be used to make authenticated requests to Google's API on behalf of the user.


## 🚀 Passport.js

Passport.js is a popular authentication middleware for Node.js, which provides a simple and flexible way to authenticate users using different strategies, including OAuth.

- **Setup**: Install Passport.js and the required strategy for Google OAuth.

  ```sh
  npm install passport passport-google-oauth20
  ```
- **Configuration**: Configure Passport with the Google strategy.
 ```ts
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://www.example.com/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
  }
));

  ```
- **Routes**: Set up the routes for authentication.
 ```ts
const express = require('express');
const passport = require('passport');

const app = express();

app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req: any, res: any) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});
  ```

## 🍪 Cookie or Session Based Authentication
Cookie or session-based authentication is a common method to manage user sessions in web applications. It involves storing user session data on the server and using cookies to maintain the session state on the client side.


### 🗂️ Serialization
Serialization is the process of converting an object into a format that can be easily stored or transmitted. In the context of authentication, it typically refers to the process of converting the user object into a session identifier.
```ts
passport.serializeUser((user: any, done: Function) => {
  done(null, user.id);
});

  ```

### 🗂️ Deserialization
Deserialization is the reverse process, where the stored session identifier is converted back into the user object. This is used to retrieve the user details from the session on subsequent requests.
```ts
passport.deserializeUser((id: string, done: Function) => {
  User.findById(id, (err: any, user: any) => {
    done(err, user);
  });
});

  ```
