import publicClient from "../client/public.client";

const gerneEndpoints = {
  list: "genres/",
  create: "genres/create",
  delete: "genres/delete",
  update: "genres/update",
};

const gerneApi = {
  getList: async () => {
    try {
      const response = await publicClient.get(gerneEndpoints.list);
      return { response };
    } catch (err) {
      return { err };
    }
  },
  getDropDownGenres: async () => {
    try {
        const response = await publicClient.get(gerneEndpoints.list); // Reuse getList function
        return response.map(genre => ({
            value: genre.id,
            label: genre.genresTitle
        }));
    } catch (error) {
        console.error("Error fetching dropdown genres:", error);
        throw error;
    }
},
  createGenre: async (genresTitle) => {
    try {
      // Convert the new genre title to lowercase
      const lowercaseTitle = genresTitle.toLowerCase();

      // Check if the genre already exists (case-insensitive)
      const existingGenre = await publicClient.get(`${gerneEndpoints.list}`);
      const genreExists = existingGenre.some(
        (genre) => genre.genresTitle.toLowerCase() === lowercaseTitle
      );
      if (genreExists) {
        return { err: { message: "Genre already exists." } };
      }

      // Genre doesn't exist, proceed with creating it
      const response = await publicClient.post(gerneEndpoints.create, {
        genresTitle,
      });
      return { response };
    } catch (err) {
      return { err };
    }
  },
  deleteGenre: async (genreId) => {
    try {
      const response = await publicClient.delete(
        `${gerneEndpoints.delete}/${genreId}`
      );
      return { response };
    } catch (err) {
      return { err };
    }
  },
  updateGenre: async (genreId, updatedTitle) => {
    try {
        // Convert the updated title to lowercase for case-insensitive comparison
        const lowercaseUpdatedTitle = updatedTitle.toLowerCase();

        // Get the list of existing genres
        const existingGenres = await publicClient.get(gerneEndpoints.list);

        // Check if any existing genre has the same title as the updated title
        const genreExists = existingGenres.some(
            genre => genre.genresTitle.toLowerCase() === lowercaseUpdatedTitle && genre.id !== genreId
        );

        // If the genre exists and its ID is different from the one being updated, return an error
        if (genreExists) {
            return { err: { message: "Genre with this title already exists." } };
        }

        // Genre doesn't exist or the ID matches, proceed with updating
        const response = await publicClient.put(`${gerneEndpoints.update}/${genreId}`, { genresTitle: updatedTitle });
        return { response };
    } catch (err) {
        return { err };
    }
}
};

export default gerneApi;
