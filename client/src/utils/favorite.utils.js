const favoriteUtils = {
  check: ({ listFavorites, mediaId }) => listFavorites && listFavorites.find(e => e.movie.id === mediaId) !== undefined
};

export default favoriteUtils;