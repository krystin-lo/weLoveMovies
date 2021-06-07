const knex = require("../db/connection");

function readCritic(critic_id) {
  console.log("Critic ID:" + critic_id);
  return knex("critics").where({ critic_id }).first();
}

// read the critic object of the review and return it
async function setCritic(review) {
  review.critic = await readCritic(review.critic_id);
  console.log("Review" + { review });
  console.log("review.critic" + review.critic);
  return review;
}

function list(movieId) {
  return knex("reviews as r")
    .join("critics as c", "r.critic_id", "c.critic_id")
    .select("*")
    .where({ movie_id: movieId });
}

function read(review_id) {
  return knex("reviews").select("*").where({ review_id }).first();
}

//update review, then respond with the review and critic objects
function update(review) {
  return knex("reviews")
    .select("*")
    .where({ review_id: review.review_id })
    .update(review, "*")
    .then(() => read(review.review_id))
    .then(setCritic);
}

function destroy(reviewId) {
  return knex("reviews").where({ review_id: reviewId }).del();
}

module.exports = {
  list,
  read,
  update,
  delete: destroy,
};