import express from "express";
import { Request, Response } from "express";
import { prisma } from "./lib/prisma.js";

const app: express.Application = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Hello World" });
});

app.get("/user", async (req: Request, res: Response) => {
    const user = await prisma.user.findMany();
    res.json(user);
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
