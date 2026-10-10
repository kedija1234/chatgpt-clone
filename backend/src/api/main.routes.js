import express from "express";
import chatRouter from "./chat/chat.routes.js";

const mainRouter = express.Router();

// /api/chat
mainRouter.use("/chat", chatRouter);

// /api/admin
// mainRouter.use('/admin', adxinRouter);

export default mainRouter;
