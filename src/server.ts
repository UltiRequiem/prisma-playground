import { PrismaClient } from "@prisma/client";
import express from "express";
import responseTime from "response-time";
import { createClient } from "redis";

const redis = createClient();
const prisma = new PrismaClient();

const app = express();

// Sets X-Response-Time
app.use(responseTime());

app.use(express.json());

app.use((_request, response, next) => {
  response.set("Author", "UltiRequiem");
  next();
});

app.get("/users", async (_req, res) => {
  const data = await redis.get("user");

  if (data) {
    console.log("From Redis");

    return res.send(data);
  }

  console.log("Preparing Redis...");

  const fromDB = await prisma.user.findMany();

  redis.set("user", JSON.stringify(fromDB), { EX: 60 });

  return res.json(fromDB);
});

app.listen(3000, async () => {
  await redis.connect();
  await prisma.$connect();

  console.log("REST API server ready at: http://localhost:3000");
});
