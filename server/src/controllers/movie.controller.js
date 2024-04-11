import responseHandler from "../handlers/response.handler.js";
import userModel from "../models/user.model.js";
import favoriteModel from "../models/favorite.model.js";
import reviewModel from "../models/review.model.js";
import tokenMiddlerware from "../middlewares/token.middleware.js";
import movieModel from "../models/movie.model.js";
import performer_movieModel from "../models/performer_movie.model.js";
import performerModel from "../models/performer.model.js";

const  create = async (req, res) => {
  try {
    const { 
      mediaType, 
      mediaTitle, 
      mediaDecription, 
      mediaRate, 
      mediaYear,
      mediaOfViewmediaRate,
      mediaLinkPoster, 
      mediaLinkTrailer, 
      mediaLinkEnbale, 
      episodes, 
      genres, 
      performerMovies 
    } = req.body;
    const savedPerformerMovies = await Promise.all(performerMovies.map(async performerMovieData => {
      const performerMovie = new performer_movieModel({
        perMoDescription: performerMovieData.perMoDescription,
        performer: performerMovieData.performer
      });
      return performerMovie.save();
    }));

    const performerMovieIds = savedPerformerMovies.map(savedPerformerMovie => savedPerformerMovie._id);

    const movie = new movieModel({
      mediaType,
      mediaTitle,
      mediaDecription,
      mediaRate,
      mediaYear,
      mediaOfViewmediaRate,
      mediaLinkPoster,
      mediaLinkTrailer,
      mediaLinkEnbale,
      episodes,
      genres,
      performer: performerMovieIds
    });
    const savedMovie = await movie.save();
    responseHandler.created(res, {
      ...savedMovie._doc,
      id: savedMovie.id,
    });
  } catch (error) {
    console.error(error);
    responseHandler.error(res);
  }
}
const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the movie
    const deletedMovie = await movieModel.findByIdAndDelete(id);

    // Check if the movie exists
    if (!deletedMovie) {
      return responseHandler.notfound(res, { error: "Movie not found" });
    }

    // Send success response
    return responseHandler.ok(res, { message: "Movie deleted successfully" });
  } catch (error) {
    console.error(error);
    // Send error response
    return responseHandler.error(res);
  }
};


const update = async (req, res) => {
  try {
    const { id } = req.params; 
    const { 
      mediaType, 
      mediaTitle, 
      mediaDecription, 
      mediaRate, 
      mediaYear,
      mediaOfViewmediaRate,
      mediaLinkPoster, 
      mediaLinkTrailer, 
      mediaLinkEnbale, 
      episodes, 
      genres, 
      performerMovies 
    } = req.body;
    
    let performerMovieId = [];
    if(performerMovies.length > 0){
      performerMovies.map(async performerMovieData => {
        await movieModel.findOneAndDelete({ performer: performerMovieData.performer });
      }); 
      const savedPerformerMovies = await Promise.all(performerMovies.map(async performerMovieData => {
        const performerMovie = new performer_movieModel({
          perMoDescription: performerMovieData.perMoDescription,
          performer: performerMovieData.performer
        });
        return performerMovie.save();
      }));
      performerMovieId = savedPerformerMovies.map(async savedPerformerMovie => savedPerformerMovie.id); 
    }
    let data = {
      mediaType,
      mediaTitle,
      mediaDecription,
      mediaRate,
      mediaYear,
      mediaOfViewmediaRate,
      mediaLinkPoster,
      mediaLinkTrailer,
      mediaLinkEnbale,
      genres
    };
    

   
    let  updatedMovie;
    if(performerMovieId != null){
      await movieModel.findByIdAndUpdate(id, { episodes: [] , performer: []});
      updatedMovie = await movieModel.findByIdAndUpdate(id, {   
        ...data,
        episodes: episodes,
        performer: performerMovieId
      }, { new: true });
    }else{
      await movieModel.findByIdAndUpdate(id, { episodes: [] });
      updatedMovie = await movieModel.findByIdAndUpdate(id, {   
        ...data,
        episodes: episodes,
      }, { new: true });
    }
    

    if (!updatedMovie) {
      responseHandler.notfound(res, {
        error: "Movie not found",
      });
    }
    responseHandler.ok(res, {
      ...updatedMovie._doc,
      id: updatedMovie.id,
    });
  } catch(err) {
    console.log(err)
    responseHandler.error(res);
  }
};

const plustView = async (req, res) => {
  try {
    const { movieId } = req.body;

    const movie = await movieModel.findById(movieId);

    if (!movie) {
      responseHandler.notfound(res, {
        error: "Movie not found",
      });
    }
    movie.mediaOfViewmediaRate++;
    await movie.save();
    responseHandler.ok(res, {
      ...movie._doc,
      id: movie.id,
    });
  } catch (err) {
    responseHandler.error(res);
    console.log(err);
  }
};

const getList = async (req, res) => {
  try {
    const movies = await movieModel.find().sort({ mediaOfViewmediaRate: -1 }).populate('performer');
    return responseHandler.ok(res, movies);
  } catch {
    responseHandler.error(res);
  }
};

const getListSlider = async (req, res) => {
  try {
    const movies = await movieModel
      .find({ mediaType: "movie" })
      .select(
        "id mediaType mediaTitle mediaLinkPoster mediaRate mediaOfViewmediaRate mediaYear mediaDecription genres"
      );

    return responseHandler.ok(res, movies);
  } catch {
    responseHandler.error(res);
  }
};

const search = async (req, res) => {
  try {
    const { title, type } = req.body;
    if (typeof title !== "string") {
      return responseHandler.notfound(res, { error: "Invalid title value" });
    }
    if (type && type === "people") {
      let query = { perName: { $regex: title || "", $options: "i" } };
      const foundPerformer = await performerModel.findOne(query);
      if (!foundPerformer) {
        return responseHandler.notfound(res, { error: "Performer not found" });
      }
      const dataMovies = await movieModel.find().populate('performer');
      const movies = dataMovies.filter(movie => 
        movie.performer.some(performer => performer.performer.equals(foundPerformer._id))
      );
      return responseHandler.ok(res, movies);
    } else {
      if (type && !["tv", "movie"].includes(type)) {
        return responseHandler.notfound(res, { error: "Invalid type value" });
      }
      let query = { mediaTitle: { $regex: title || "", $options: "i" } };
      if (type) {
        query.mediaType = type;
      }
  
      if (type) {
        if (!["tv", "movie"].includes(type)) {
          return responseHandler.notfound(res, { error: "Invalid type value" });
        }
        query.mediaType = type;
      }
  
      const movies = await movieModel.find(query);
      return responseHandler.ok(res, movies);
    }
  } catch (err) {
    console.error(err);
    return responseHandler.error(res);
  }
};

const getDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await movieModel.findById(id).populate('episodes');
    
    if (!movie) {
      responseHandler.notfound(res, {
        error: "Movie not found",
      });
    }

    const tokenDecoded = tokenMiddlerware.tokenDecode(req);

    if (tokenDecoded) {
      const user = await userModel.findById(tokenDecoded.data);

      if (user) {
        const isFavorite = await favoriteModel.findOne({ user: user.id, id });
        movie.isFavorite = isFavorite !== null;
      }
    }

    movie.reviews = await reviewModel
      .find({ id })
      .populate("user")
      .sort("-createdAt");
    responseHandler.ok(res, movie);
  } catch (e) {
    console.log(e);
    responseHandler.error(res);
  }
};

const getLinkFirm = async (req, res) => {
  try {
    const { id,episode} = req.params;
    const movie = await movieModel.findById(id).populate('episodes');
    
    if (!movie) {
      responseHandler.notfound(res, {
        error: "Movie not found",
      });
    }
    const link = movie.episodes.filter(item=>item.episodeNumber === parseInt(episode));
    const dataReponse = {
       id: movie.id,
       title:link[0].title,
       episodeNumber:link[0].episodeNumber,
       mediaLinkEnbale:link[0].mediaLinkEnbale,
       type: movie.mediaType,
       title: movie.mediaTitle,
       episodes: movie.episodes.length
    }
    responseHandler.ok(res, dataReponse);
  } catch (e) {
    console.log(e);
    responseHandler.error(res);
  }
};

export default {
  create,
  update,
  getList,
  search,
  getDetail,
  getListSlider,
  plustView,
  deleteMovie,
  getLinkFirm,
};
