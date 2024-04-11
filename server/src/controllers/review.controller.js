import responseHandler from "../handlers/response.handler.js";
import reviewModel from "../models/review.model.js";
import movieModel from "../models/movie.model.js";
const create = async (req, res) => {
  try {
    const { movie } = req.body;

    const review = new reviewModel({
      user: req.user.id,
      user_name: req.user.displayName,
      movie: movie.id,
      ...req.body
    });

    await review.save();

    responseHandler.created(res, {
      ...review._doc,
      id: review.id,
      user: req.user
    });
  } catch(err) {
    console.log(err)
    responseHandler.error(res);
  }
};

const remove = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await reviewModel.findOne({
      _id: reviewId,
      user: req.user.id
    });

    if (!review) return responseHandler.notfound(res);

    await review.remove();

    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};

const getReviewsAll = async (req, res) => {
  const { mediaId } = req.params;
  try {
    const reviews = await reviewModel.find({ movie: mediaId })
      .sort("-createdAt")
      .populate({ path: 'replies', populate: { path: 'replies' } }); 

    responseHandler.ok(res, reviews);
  } catch (error) {
    console.error(error);
    responseHandler.error(res);
  }
};

const getReviewsOfUser = async (req, res) => {
  try {
    const uniqueMovies = await reviewModel.distinct("movie", { user: req.user.id});
    const reviews = await Promise.all(uniqueMovies.map(async (movieId) => {
      const review = await reviewModel.findOne({ user: req.user.id, movie: movieId }).select('id').sort("-createdAt");
      const movie = await movieModel.findById(movieId).select('id mediaLinkPoster mediaType'); 
      return { review, movie };
    }));

    responseHandler.ok(res, reviews);
  } catch {
    responseHandler.error(res);
  }
};

const addReply = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { content, movie } = req.body;

    const review = await reviewModel.findById(reviewId);

    if (!review) {
      return responseHandler.notfound(res);
    }

    const reply = new reviewModel({
      user: req.user.id,
      user_name: req.user.displayName,
      movie: movie,
      content, 
    });

    await reply.save();
    review.replies.push(reply);
    await review.save();

    responseHandler.ok(res, review);
  } catch (error) {
    console.error(error);
    responseHandler.error(res);
  }
};

const removeReply = async (req, res) => {
  try {
    const { reviewId, replyId } = req.params;

    const review = await reviewModel.findById(reviewId);

    if (!review) {
      return responseHandler.notfound(res);
    }

    review.replies = review.replies.filter(reply => reply._id.toString() !== replyId);
    await review.save();

    responseHandler.ok(res);
  } catch (error) {
    console.error(error);
    responseHandler.error(res);
  }
};

export default { create, remove, getReviewsOfUser, getReviewsAll, addReply, removeReply };
