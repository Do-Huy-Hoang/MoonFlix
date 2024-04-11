import express from "express";
import userRoute from "./user.route.js";
import mediaRoute from "./media.route.js";
import genresRoute from "./genres.route.js";
import reviewRoute from "./review.route.js";
import perfomerRoute from "./perfomer.router.js";
import perfomerMovieRoute from "./performer_movie.route.js";

const router = express.Router();

router.use("/user", userRoute);
router.use("/perfomer", perfomerRoute);
router.use("/perfomer-movie", perfomerMovieRoute);
router.use("/genres", genresRoute);
router.use("/reviews", reviewRoute);
router.use("/movie", mediaRoute);
export default router;