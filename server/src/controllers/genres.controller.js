import responseHandler from "../handlers/response.handler.js";
import genresModel from "../models/genres.model.js";

const getAllGenres = async (req, res) => {
  try {
    const genres = await genresModel.find();
    responseHandler.ok(res, genres);
  } catch {
    responseHandler.error(res);
  };
}

const createGenre = async (req, res) => {
  try {
    const { genresTitle } = req.body;
    const newGenre = new genresModel({ genresTitle });
    await newGenre.save();
    responseHandler.created(res, newGenre);
  } catch (error) {
    responseHandler.error(res);
  }
};

const updateGenre = async (req, res) => {
  try {
    const { id } = req.params;
    const { genresTitle } = req.body;
    const updatedGenre = await genresModel.findByIdAndUpdate(id, { genresTitle }, { new: true });
    responseHandler.ok(res, updatedGenre);
  } catch (error) {
    responseHandler.error(res);
  }
};

const deleteGenre = async (req, res) => {
  try {
    const { id } = req.params;
    await genresModel.findByIdAndDelete(id);
    responseHandler.ok(res, { message: 'Genre deleted successfully' });
  } catch (error) {
    responseHandler.error(res);
  }
};

export default { getAllGenres, createGenre, updateGenre, deleteGenre };