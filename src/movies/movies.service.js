const knex = require("../db/connection");

// if is_showing is true, return only movies that are currently showing, else return all movies
function list({ is_showing }) {
  if (is_showing) {
    return knex("movies as m")
      .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
      .distinct(
        "m.movie_id",
        "m.title",
        "m.runtime_in_minutes",
        "m.rating",
        "m.description",
        "m.image_url"
      )
      .where({ "mt.is_showing": true });
  }
  return knex("movies as m").select(
    "m.movie_id",
    "m.title",
    "m.runtime_in_minutes",
    "m.rating",
    "m.description",
    "m.image_url"
  );
}

function read(movie_id) {
  return knex("movies").select("*").where({ movie_id }).first();
}

module.exports = { list, read };