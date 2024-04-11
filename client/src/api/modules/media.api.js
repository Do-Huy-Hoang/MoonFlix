import publicClient from "../client/public.client";
const mediaEndpoints = {
  getList: "movie",
  getListSlider: "movie/getlist-slider",
  getDetail: ({ mediaId }) => `movie/detail/${mediaId}`,
  getFirmApi: ({ mediaId, episode }) => `movie/firm/${mediaId}/${episode}`,
  plustView: "movie/plust-view",
  search: "movie/search"
};

const mediaApi = {
  getList: async () => {
    try {
      const response = await publicClient.get(mediaEndpoints.getList);
      return { response };
    } catch (err) {
      return { err };
    }
  },
  getListSlider: async () => {
    try {
      const response = await publicClient.get(mediaEndpoints.getListSlider);
      return { response };
    } catch (err) {
      return { err };
    }
  },
  getDetail: async ({ mediaId }) => {
    try {
      const response = await publicClient.get(
        mediaEndpoints.getDetail({ mediaId })
      );

      return { response };
    } catch (err) {
      return { err };
    }
  },
  getFirm: async ({mediaId, episode }) => {
    try {
      const response = await publicClient.get(
        mediaEndpoints.getFirmApi({ mediaId,episode })
      );

      return { response };
    } catch (err) {
      return { err };
    }
  },

  
  plustView: async ({ mediaId }) => {
    try {
      const response = await publicClient.post(mediaEndpoints.plustView, {
        movieId: mediaId,
      });
      return { response };
    } catch (err) {
      return { err };
    }
  },
  search: async ({ mediaType, query }) => {
    try {
      const response = await publicClient.post(mediaEndpoints.search, { title: query, type: mediaType });
      return { response };
    } catch (err) {
      return { err };
    }
  },
};

export default mediaApi;
