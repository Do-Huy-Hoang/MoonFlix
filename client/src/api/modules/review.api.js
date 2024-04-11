import privateClient from "../client/private.client";

const reviewEndpoints = {
  getList: ({ mediaId }) => `reviews/${mediaId}`,
  add:"reviews",
  getListOfUser: "reviews",
  remove: ({ reviewId }) => `reviews/${reviewId}`,
  addReply: ({ reviewId }) => `reviews/${reviewId}/reply`,
  removeReply: ({ reviewId, replyId }) => `reviews/${reviewId}/reply/${replyId}`
};

const reviewApi = {
  add: async ({ content, movie }) => {
    try {
      const response = await privateClient.post(reviewEndpoints.add, {
        content,
        movie
      });
      return { response };
    } catch (err) {

      return { err };
    }
  },
  remove: async ({ reviewId }) => {
    try {
      const response = await privateClient.delete(reviewEndpoints.remove({ reviewId }));
      return { response };
    } catch (err) {
      return { err };
    }
  },
  getList: async (mediaId) => { 
    try {
      const response = await privateClient.get(reviewEndpoints.getList({ mediaId })); 
      return { response };
    } catch (err) {
      return { err };
    }
  },
  getListOfUser: async () => { 
    try {
      const response = await privateClient.get(reviewEndpoints.getListOfUser); 
      return { response };
    } catch (err) {
      return { err };
    }
  },
  addReply: async ({ reviewId, content, movie }) => {
    try {
      const response = await privateClient.post(reviewEndpoints.addReply({ reviewId }), { content }, {movie});
      return { response };
    } catch (err) {
      return { err };
    }
  },
  removeReply: async ({ reviewId, replyId }) => {
    try {
      const response = await privateClient.delete(reviewEndpoints.removeReply({ reviewId, replyId }));
      return { response };
    } catch (err) {
      return { err };
    }
  }
};

export default reviewApi;
