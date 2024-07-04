import express, { NextFunction, Request, Response } from "express";
import path from "path";
import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import cookieSession from "cookie-session";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

const config = {
  CLIENT_ID: process.env.CLIENT_ID as string,
  CLIENT_SECRET: process.env.CLIENT_SECRET as string,
  COOKIE_KEY1: process.env.COOKIE_KEY1 as string,
  COOKIE_KEY2: process.env.COOKIE_KEY2 as string,
};

// Configure Passport.js
passport.use(
  new Strategy(
    {
      clientID: config.CLIENT_ID,
      clientSecret: config.CLIENT_SECRET,
      callbackURL: `http://localhost:${PORT}/auth/google/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);

// Save the session to the cookie
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Read the session to the cookie
passport.deserializeUser((id: string, done) => {
  done(null, id);
});

const app = express();

app.use(
  cookieSession({
    name: "session",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    keys: [config.COOKIE_KEY1, config.COOKIE_KEY2],
  })
);

app.use((req: Request, res: Response, next: NextFunction) => {
  // Stub out missing regenerate and save functions.
  // These don't make sense for client side sessions.
  if (req.session && !req.session.regenerate) {
    req.session.regenerate = (cb: () => void) => {
      cb();
    };
  }
  if (req.session && !req.session.save) {
    req.session.save = (cb: () => void) => {
      cb();
    };
  }
  next();
});

app.use(passport.initialize());
app.use(passport.session());

const checkLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  const isLoggedIn = req.isAuthenticated() && req.user;
  if (!isLoggedIn) {
    return res.status(401).json({
      error: "You must log in!",
    });
  }
  next();
};

app.get("/auth/google", passport.authenticate("google", { scope: ["email"] }));

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/failure",
    successRedirect: "/",
    session: true,
  }),
  (req: Request, res: Response) => {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

app.get("/auth/logout", (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.get("/failure", (req: Request, res: Response) => {
  return res.status(401).json({
    error: "Failed to log in!",
  });
});

app.get("/secret", checkLoggedIn, (req: Request, res: Response) => {
  return res.send("The secret message is: BIZOU");
});

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../", "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
