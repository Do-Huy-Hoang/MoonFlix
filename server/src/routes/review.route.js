import express from "express";
import { body, param } from "express-validator";
import reviewController from "../controllers/review.controller.js";
import tokenMiddleware from "../middlewares/token.middleware.js";
import requestHandler from "../handlers/request.handler.js";

const router = express.Router({ mergeParams: true });

router.get(
  "/",
  tokenMiddleware.auth,
  reviewController.getReviewsOfUser
);
router.get(
  "/:mediaId",
  reviewController.getReviewsAll
);

router.post(
  "/",
  tokenMiddleware.auth,
  body("movie")
    .exists().withMessage("mediaId is required")
    .isLength({ min: 1 }).withMessage("mediaId can not be empty"),
  body("content")
    .exists().withMessage("content is required")
    .isLength({ min: 1 }).withMessage("content can not be empty"),
  requestHandler.validate,
  reviewController.create
);

router.delete(
  "/:reviewId",
  tokenMiddleware.auth,
  param("reviewId")
    .exists().withMessage("reviewId is required")
    .isLength({ min: 1 }).withMessage("reviewId can not be empty"),
  requestHandler.validate,
  reviewController.remove
);

router.post(
  "/:reviewId/reply",
  tokenMiddleware.auth,
  param("reviewId")
    .exists().withMessage("reviewId is required")
    .isLength({ min: 1 }).withMessage("reviewId can not be empty"),
  body("content")
    .exists().withMessage("content is required")
    .isLength({ min: 1 }).withMessage("content can not be empty"),
  requestHandler.validate,
  reviewController.addReply
);

router.delete(
  "/:reviewId/reply/:replyId",
  tokenMiddleware.auth,
  param("reviewId")
    .exists().withMessage("reviewId is required")
    .isLength({ min: 1 }).withMessage("reviewId can not be empty"),
  param("replyId")
    .exists().withMessage("replyId is required")
    .isLength({ min: 1 }).withMessage("replyId can not be empty"),
  requestHandler.validate,
  reviewController.removeReply
);

export default router;