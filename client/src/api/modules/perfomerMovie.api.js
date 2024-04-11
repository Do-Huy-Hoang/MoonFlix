import publicClient from "../client/public.client";

const performerMovieEndpoints = {
  list: "perfomer-movie/",
  detail: "perfomer-movie/detail",
};

const performerMovieApi = {
  getList: async (performerMovieIds) => {
    try {
      const response = await publicClient.post(
        performerMovieEndpoints.list,
        {performerMovieIds}
      );
      return { response };
    } catch (err) {
      return { err };
    }
  },
  detail: async (perId, permoId) => {
    try {
      const response = await publicClient.post(
        performerMovieEndpoints.detail,
        {perId:perId, perMoId:permoId}
      );
      return { response };
    } catch (err) {
      return { err };
    }
  },
};

export default performerMovieApi;
