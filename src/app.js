const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function getRepositoryIndex(request, response, next) {
  const { id } = request.params;

  request.repoIndex = repositories.findIndex((repo) => repo.id === id);

  if (request.repoIndex < 0) {
    return response.status(400).json({ error: "Repository not found." });
  }

  return next();
}

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;

  const repo = {
    id: uuid(),
    url,
    title,
    techs,
    likes: 0,
  };

  repositories.push(repo);

  return response.status(201).json(repo);
});

app.put("/repositories/:id", getRepositoryIndex, (request, response) => {
  const { repoIndex } = request;
  const { url, title, techs } = request.body;

  repositories[repoIndex] = {
    ...repositories[repoIndex],
    url: url || repositories[repoIndex].url,
    title: title || repositories[repoIndex].title,
    techs: techs || repositories[repoIndex].techs,
  };

  return response.status(200).json(repositories[repoIndex]);
});

app.delete("/repositories/:id", getRepositoryIndex, (request, response) => {
  const { repoIndex } = request;

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", getRepositoryIndex, (request, response) => {
  const { repoIndex } = request;

  repositories[repoIndex].likes += 1;

  return response.status(200).json(repositories[repoIndex]);
});

module.exports = app;
