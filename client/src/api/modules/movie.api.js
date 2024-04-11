import publicClient from "../client/public.client";

const movieEndpoints = {
  list: "movie/",
  create: "movie/create/",
  delete: "movie/delete",
  update: "movie/update"
};

const movieApi = {
  getList: async () => {
    try {
      const response = await publicClient.get(movieEndpoints.list);
      return { response };
    } catch (err) {
      return { err };
    }
  },
  createMovie: async (movieData) => {
    try {
      const response = await publicClient.post(
        movieEndpoints.create,
        movieData
      );
      return { data: response.data }; 
    } catch (error) {
      console.error("Error creating movie:", error);
      throw error;
    }
  },
  deleteMovie: async (movieId) => { 
    try {
      const response = await publicClient.delete(
        `${movieEndpoints.delete}/${movieId}` 
      );
      return { response };
    } catch (err) {
      return { err };
    }
  },
  updateMovie: async (movieId, movieData) => {
    try {
      const response = await publicClient.post(
        `${movieEndpoints.update}/${movieId}`,
        movieData
      );
      return { response };
    } catch (err) {
      return { err };
    }
  }
};

export default movieApi;
