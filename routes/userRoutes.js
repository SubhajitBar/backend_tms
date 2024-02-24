import express from "express";
import { createTask, deleteTask, deleteUser, getAllUser, getMyAllTasks, getMyProfile, login, logout, signup, updateTasks } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/Auth.js";

const router = express.Router();
// Auth
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticated, getMyProfile);

// Task 
router.route("/task").get(isAuthenticated, getMyAllTasks).post(isAuthenticated, createTask);
router.route("/task/:id").put(isAuthenticated, updateTasks).delete(isAuthenticated, deleteTask);


// Admin
router.route("/user").get(getAllUser);
router.route("/user/:id").delete(deleteUser);


export default router;