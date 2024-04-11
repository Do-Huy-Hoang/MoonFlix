import express from "express";
import movieController from "../controllers/movie.controller.js";

const router = express.Router();

router.post("/create", movieController.create);
router.delete("/delete/:id",movieController.deleteMovie)

router.post("/update/:id", movieController.update);
router.post("/plust-view", movieController.plustView);
router.post("/search", movieController.search);
router.get("/firm/:id/:episode", movieController.getLinkFirm);
router.get("/detail/:id", movieController.getDetail);

router.get("/", movieController.getList);
router.get("/getlist-slider", movieController.getListSlider);

export default router;