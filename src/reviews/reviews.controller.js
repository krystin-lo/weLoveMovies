const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const reduceProperties = require("../utils/reduce-properties");

// make sure that the review already exists
async function reviewExists(req, res, next) {
  const { reviewId } = req.params;
  const review = await service.read(reviewId);
  if (review) {
    res.locals.review = review;
    return next();
  }
  return next({ status: 404, message: "Review cannot be found." });
}

// use reduceProperties function to nest critics table into separate object
const reduceReviews = reduceProperties("review_id", {
  critic_id: ["critic", "critic_id"],
  preferred_name: ["critic", "preferred_name"],
  surname: ["critic", "surname"],
  organization_name: ["critic", "organization_name"],
  created_at: ["critic", "created_at"],
  updated_at: ["critic", "updated_at"],
});

// take movieID parameter to list reviews and critics for only that movie
async function list(req, res) {
  const { movieId } = req.params;
  const data = await service.list(movieId);
  res.json({ data: reduceReviews(data) });
}

async function update(req, res) {
  const updatedReview = {
    ...req.body.data,
    review_id: res.locals.review.review_id,
  };
  const data = await service.update(updatedReview);
  res.json({ data });
}

async function destroy(req, res) {
  service.delete(res.locals.review.review_id).then(() => res.sendStatus(204));
}

module.exports = {
  list: asyncErrorBoundary(list),
  update: [reviewExists, asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
  reviewExists,
};