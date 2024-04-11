import performerModel from "../models/performer.model.js";
import performer_movieModel from "../models/performer_movie.model.js";
import mongoose from "mongoose";
const getAllPerformerMovies = async (req, res) => {
  try {
    const { performerMovieIds } = req.body; 
    const performerMovies  = await performer_movieModel.find({_id: { $in: performerMovieIds?.map(id => mongoose.Types.ObjectId(id)) } });
    const performerIds = performerMovies.reduce((ids, performerMovie) => {
      const performerId = performerMovie.performer;
      ids.push(performerId); 
      return ids;
    }, []);
    const performers = await performerModel.find({_id: { $in: performerIds?.map(id => mongoose.Types.ObjectId(id))  } });
    const dataReponse = {
      performers: performers,
      performerMovies: performerMovies,
    }
    res.json(dataReponse);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};

const getPerformerMovies = async (req, res) => {
  try {
    const { perId,perMoId } = req.body; 
   
    const performers = await performerModel.findById(perId);
    const performerMovies  = await performer_movieModel.find({_id:mongoose.Types.ObjectId(perMoId) , performer: performers.id });
    const dataReponse = {
      performer:performers,
      perMoDescription: performerMovies[0].perMoDescription
    }
   
    res.json(dataReponse);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: error.message });
  }
};

export default { getAllPerformerMovies, getPerformerMovies };