import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import usersRouter from "./users";
import productsRouter from "./products";
import salesRouter from "./sales";
import bcvRouter from "./bcv";
import comerciosRouter from "./comercios";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/products", productsRouter);
router.use("/sales", salesRouter);
router.use("/bcv", bcvRouter);
router.use("/comercios", comerciosRouter);

export default router;
