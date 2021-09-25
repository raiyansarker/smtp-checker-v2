require("dotenv").config();
const serverless = require("serverless-http");
const express = require("express");
const helmet = require("helmet");
const validator = require("email-validator");
const nodemailer = require("nodemailer");
const Redis = require("ioredis");
const { RateLimiterRedis } = require("rate-limiter-flexible");
const requestIP = require("request-ip");

const app = express();
const router = express.Router();
app.use(express.json());
app.use(helmet());
app.use(requestIP.mw());

const redisClient = new Redis(process.env.REDIS_CONNECT);

const rateLimitOptions = {
  storeClient: redisClient,
  keyPrefix: "middleware",
  points: process.env.POINTS,
  duration: process.env.DURATION,
};
const rateLimiter = new RateLimiterRedis(rateLimitOptions);

const rateLimiterMiddleware = (req, res, next) => {
  let ip = req.clientIp;

  rateLimiter
    .consume(ip)
    .then((rateLimiterRes) => {
      const headers = {
        "X-RateLimit-Limit": rateLimitOptions.points,
        "X-RateLimit-Remaining": rateLimiterRes.remainingPoints,
      };
      req.rateLimitHeaders = headers;
      next();
    })
    .catch((rateLimiterRes) => {
      const headers = {
        "Retry-After": rateLimiterRes.msBeforeNext / 1000,
        "X-RateLimit-Limit": rateLimitOptions.points,
        "X-RateLimit-Remaining": rateLimiterRes.remainingPoints,
        "X-RateLimit-Reset": new Date(Date.now() + rateLimiterRes.msBeforeNext),
      };
      res
        .set(headers)
        .status(429)
        .json({ message: "Too many requests", code: 429 });
    });
};

app.use(rateLimiterMiddleware);

router.get("/", (req, res) => {
  // Just for fun
  return res
    .set(req.rateLimitHeaders)
    .redirect("https://www.youtube.com/watch?v=DLzxrzFCyOs");
});

router.post("/", async (req, res) => {
  const { server, port, username, password, from, to } = req.body;
  if (server && port && username && password && from && to) {
    if (port === 25)
      return res
        .set(req.rateLimitHeaders)
        .status(400)
        .json({ message: "Port 25 is blocked", code: 400 });

    if (validator.validate(from) && validator.validate(to)) {
      const transporter = nodemailer.createTransport({
        host: server,
        port: port,
        secure: port === 465 ? true : false,
        auth: {
          user: username,
          pass: password,
        },
      });

      await transporter
        .sendMail({
          from,
          to,
          subject: "SMTP is working 🎉",
          html: `
          <p>This mail was directly sent by ${server}</p>

          <p>SMTP host: ${server}</p>
          <p>Port: ${port}</p>
          <p>Use SSL: ${port === "465" ? `Yes` : `No`}</p>
          <p>Authentication username: ${username}</p>
          <p>Email from: ${from}</p>
          <p>Email to: ${to}</p>
          
          <p>This service is provided by https://smtp-checker.raiyansarker.com</p>
        `,
        })
        .then(() => {
          return res
            .set(req.rateLimitHeaders)
            .status(200)
            .json({ message: "Mail sent successfully", code: 200 });
        })
        .catch(() => {
          return res
            .set(req.rateLimitHeaders)
            .status(400)
            .json({ message: "Incorrect credentials", code: 400 });
        });
    } else {
      return res
        .set(req.rateLimitHeaders)
        .status(400)
        .json({ message: "Email is not valid", code: 400 });
    }
  } else {
    return res
      .set(req.rateLimitHeaders)
      .status(400)
      .json({ message: "Fields are empty", code: 400 });
  }
});

app.use("/api/check", router);
module.exports.handler = serverless(app);
