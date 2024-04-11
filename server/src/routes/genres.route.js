import express from "express";
import genresController from "../controllers/genres.controller.js";

const router = express.Router({ mergeParams: true });

router.get('/', genresController.getAllGenres);
router.post('/create', genresController.createGenre);
router.put('/update/:id', genresController.updateGenre);
router.delete('/delete/:id', genresController.deleteGenre);

export default router;