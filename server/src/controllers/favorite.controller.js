import responseHandler from "../handlers/response.handler.js";
import favoriteModel from "../models/favorite.model.js";
import movieModel from "../models/movie.model.js";

const addFavorite = async (req, res) => {
  try {
    const isFavorite = await favoriteModel.findOne({
      user: req.user.id,
      movie: req.body.movieId
    });

    if (isFavorite) return responseHandler.ok(res, isFavorite);

    const favorite = new favoriteModel({
      user: req.user.id,
      movie: req.body.movieId
    });

    await favorite.save();

    const movie = await movieModel.findById(req.body.movieId);

    responseHandler.created(res, { favorite, movie });
  } catch {
    responseHandler.error(res);
  }
};

const removeFavorite = async (req, res) => {
  try {
    const { favoriteId } = req.params;

    const favorite = await favoriteModel.findOne({
      user: req.user.id,
      _id: favoriteId
    });

    if (!favorite) return responseHandler.notfound(res);

    await favorite.remove();

    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};

const getFavoritesOfUser = async (req, res) => {
  try {
    const favorites = await favoriteModel.find({ user: req.user.id }).sort("-createdAt");

    const favoritesWithMovies = await Promise.all(
      favorites.map(async (favorite) => {
        const movie = await movieModel.findById(favorite.movie).select("id mediaType mediaTitle mediaLinkPoster mediaRate mediaOfViewmediaRate mediaYear");
        return { favorite, movie };
      })
    );

    responseHandler.ok(res, favoritesWithMovies);
  } catch {
    responseHandler.error(res);
  }
};

export default { addFavorite, removeFavorite, getFavoritesOfUser };
