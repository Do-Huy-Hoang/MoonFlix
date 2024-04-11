import responseHandler from "../handlers/response.handler.js";
import performerModel from "../models/performer.model.js";

const getAllPerformers = async (req, res) => {
    try {
        const performers = await performerModel.find();
        responseHandler.ok(res, performers);
    } catch {
        responseHandler.error(res);
    };
};

const createPerformer = async (req, res) => {
    try {
        const { perName, perYear, perAvatar } = req.body;
        const newPerformer = new performerModel({
             perName: perName, 
             perYear: perYear, 
             perAvatar: perAvatar
            });
        await newPerformer.save();
        responseHandler.created(res, newPerformer);
    } catch (error) {
        console.log(error)
        responseHandler.error(res);
    }
};

const updatePerformer = async (req, res) => {
    try {
        const { id } = req.params;
        const { perName, perYear, perAvatar } = req.body;
        const updatedPerformer = await performerModel.findByIdAndUpdate(id, { perName, perYear, perAvatar }, { new: true });
        responseHandler.ok(res, updatedPerformer);
    } catch (error) {
        responseHandler.error(res);
    }
};

const deletePerformer = async (req, res) => {
    try {
        const { id } = req.params;
        await performerModel.findByIdAndDelete(id);
        responseHandler.ok(res, { message: 'Performer deleted successfully' });
    } catch (error) {
        responseHandler.error(res);
    }
};

export default { getAllPerformers, createPerformer, updatePerformer, deletePerformer };