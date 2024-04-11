import express from "express";
import { body } from "express-validator";
import favoriteController from "../controllers/favorite.controller.js";
import userController from "../controllers/user.controller.js";
import requestHandler from "../handlers/request.handler.js";
import userModel from "../models/user.model.js";
import tokenMiddleware from "../middlewares/token.middleware.js";

const router = express.Router();
const passwordValidator = (value) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  if (!regex.test(value)) {
    throw new Error("password must contain at least one uppercase letter, one lowercase letter, and one number");
  }
  return true;
};
router.post(
  "/signup",
  body("username")
    .exists().withMessage("username is required")
    .isLength({ min: 8 }).withMessage("username minimum 8 characters")
    .custom(async value => {
      const user = await userModel.findOne({ username: value });
      if (user) return Promise.reject("username already used");
    }),
  body("password")
    .exists().withMessage("password is required")
    .isLength({ min: 8 }).withMessage("password minimum 8 characters")
    .custom(passwordValidator), 
  body("confirmPassword")
    .exists().withMessage("confirmPassword is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) throw new Error("confirmPassword not match");
      return true;
    }),
  body("displayName")
    .exists().withMessage("displayName is required")
    .isLength({ min: 8 }).withMessage("displayName minimum 8 characters"),
  requestHandler.validate,
  userController.signup
);

router.post(
  "/signin",
  body("username")
    .exists().withMessage("username is required"),
  body("password")
    .exists().withMessage("password is required"),
  requestHandler.validate,
  userController.signin
);

router.put(
  "/update-password",
  tokenMiddleware.auth,
  body("password")
    .exists().withMessage("password is required")
    .isLength({ min: 8 }).withMessage("password minimum 8 characters"),
  body("newPassword")
    .exists().withMessage("newPassword is required")
    .isLength({ min: 8 }).withMessage("newPassword minimum 8 characters"),
  body("confirmNewPassword")
    .exists().withMessage("confirmNewPassword is required")
    .isLength({ min: 8 }).withMessage("confirmNewPassword minimum 8 characters")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) throw new Error("confirmNewPassword not match");
      return true;
    }),
  requestHandler.validate,
  userController.updatePassword
);

router.get(
  "/info",
  tokenMiddleware.auth,
  userController.getInfo
);

router.get(
  "/favorites",
  tokenMiddleware.auth,
  favoriteController.getFavoritesOfUser
);

router.post(
  "/favorites",
  tokenMiddleware.auth,
  body("movieId")
    .exists().withMessage("movieId is required")
    .isLength({ min: 1 }).withMessage("movieId can not be empty"),
  requestHandler.validate,
  favoriteController.addFavorite
);

router.delete(
  "/favorites/:favoriteId",
  tokenMiddleware.auth,
  favoriteController.removeFavorite
);

export default router;