import express, { NextFunction, Request, Response } from "express";
import path from "path";
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

function checkLoggedIn(req: Request, res: Response, next: NextFunction) {
  const isLoggedIn = true;
  if (!isLoggedIn) {
    return res.status(401).json({
      error: "you must log in!",
    });
  }
  next();
}

app.get("/auth/google", (req: Request, res: Response) => {});

app.get("/auth/google/callback", (req: Request, res: Response) => {});

app.get("/auth/logout", (req: Request, res: Response) => {});

app.get("/secret", checkLoggedIn, (req: Request, res: Response) => {
  res.send("the secret message is: BIZOU");
});

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../", "public", "index.html"));
});

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
