const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// make sure that movie exists
async function movieExists(req, res, next) {
  const { movieId } = req.params;
  const movie = await service.read(movieId);
  if (movie) {
    res.locals.movie = movie;
    return next();
  }
  return next({ status: 404, message: "Movie cannot be found." });
}

// list movies based on request query
async function list(req, res) {
  const data = await service.list(req.query);
  res.json({ data });
}

async function read(req, res) {
  const { movie: data } = res.locals;
  res.json({ data });
}

module.exports = {
  read: [movieExists, asyncErrorBoundary(read)],
  list: asyncErrorBoundary(list),
  movieExists,
};