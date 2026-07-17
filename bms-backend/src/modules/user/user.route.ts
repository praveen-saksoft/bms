import { Router } from "express";
import * as UserController from "./user.controller";

const router = Router();

router.post("/", UserController.createUser);
router.get("/", UserController.getAllUsers);
router.get("/:id", UserController.getUserById);
router.patch("/activate/:id", UserController.activateUser);

export default router;
