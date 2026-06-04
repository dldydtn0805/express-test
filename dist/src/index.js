import express from "express";
import { prisma } from "./lib/prisma.js";
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
    res.json({ message: "Hello World" });
});
app.get("/user", async (req, res) => {
    const user = await prisma.user.findMany();
    res.json(user);
});
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
