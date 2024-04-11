import express from "express";
import perfomerController from "../controllers/perfomer.controller.js";

const router = express.Router({ mergeParams: true });

router.get('/', perfomerController.getAllPerformers);

router.post('/create', perfomerController.createPerformer);

router.put('/update/:id', perfomerController.updatePerformer);

router.delete('/delete/:id', perfomerController.deletePerformer);

export default router;