import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { clerkMiddleware, getAuth } from '@hono/clerk-auth'
import { shouldBeUser } from "./middleware/authMiddleware.js";
import sessionRoute from "./routes/session.route.js";
import { cors } from "hono/cors";
import webhookRoute from "./routes/webhooks.route.js";

const app = new Hono();

app.use('*', clerkMiddleware())
app.use('*', cors({origin:["http://localhost:3002"]}))

app.get("/health", (c) => {
  return c.json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});

app.route("/sessions", sessionRoute);
app.route("/webhooks", webhookRoute);

app.get('/test', shouldBeUser, (c) => {

  return c.json({
    message: 'Payment service is authenticated',
    userId: c.get("userId")
  })
})

const start = async () => {
  try {
    serve(
      {
        fetch: app.fetch,
        port: 8002,
      },
      (info) => {
        console.log("Payment service is running on port 8002");
      }
    );
  } catch (error) {
    console.log(error);
    process.exit;
  }
};

start()
