import { Router, type IRouter } from "express";
import healthRouter from "./health";
import insurexRouter from "./insurex";

const router: IRouter = Router();

router.use(healthRouter);
router.use(insurexRouter);

export default router;
