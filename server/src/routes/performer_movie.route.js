import express from "express";
import performerMovieController from "../controllers/performer_movie.controller.js";

const router = express.Router({ mergeParams: true });

router.post("/", performerMovieController.getAllPerformerMovies);
router.post("/detail", performerMovieController.getPerformerMovies);
export default router;