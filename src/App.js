import React, { useState, useEffect } from "react";
import uuid from "uuid-v4";
import {
  Add,
  ArrowRightAlt,
  RemoveCircleOutlineOutlined,
  ThumbUp,
} from "@material-ui/icons";

import api from "./services/api";
import Tech from "./components/EntryTech";

import "./styles.css";
import uuidV4 from "uuid-v4";

function App() {
  const [repositories, setRepositories] = useState([]);
  const [nameEntry, setNameEntry] = useState("");
  const [urlEntry, setUrlEntry] = useState("");
  const [techs, setTechs] = useState([]);
  const [techNames, setTechNames] = useState([]);

  useEffect(() => {
    updateFromAPI();
  }, []);

  useEffect(() => {
    addTech();
  }, []);

  function updateFromAPI() {
    api.get("repositories").then((responseFromAPI) => {
      responseFromAPI.data.forEach(
        (repository) => (repository.toggleLike = false)
      );
      setRepositories(responseFromAPI.data);
    });
  }

  function addTech() {
    const toAdd = techs ? techs : [];
    setTechs([
      ...toAdd,
      <Tech
        key={uuid.random()}
        techNameEntry={techNameEntry}
        techNameRemove={techNameRemove}
      />,
    ]);
  }

  function removeSelf() {
    setTechNames((currentTechName) =>
      currentTechName.filter((techName, index) => {
        return index !== techNames.length - 1;
      })
    );
    setTechs((currentTechs) =>
      currentTechs.filter((tech, index) => index !== techs.length - 1)
    );
  }

  async function handleAddRepository(id, url, name, tech) {
    api
      .post("repositories", {
        name,
        url,
        tech,
      })
      .then((newRepo) =>
        setRepositories((currentRepositories) => {
          newRepo.data.toggleLike = false;
          return [...currentRepositories, newRepo.data];
        })
      );
  }

  async function handleRemoveRepository(id) {
    api.delete(`repositories/${id}`).then(() => {
      setRepositories((currentRepositories) =>
        currentRepositories.filter((repository) => repository.id !== id)
      );
    });
  }

  function handleAddLike(id) {
    const index = repositories.findIndex(
      (eachRespository) => eachRespository.id === id
    );

    api.post(`repositories/${id}/like`).then((repositoryUpdated) => {
      setRepositories((currentRepositories) => {
        currentRepositories[index] = repositoryUpdated.data;
        currentRepositories[index].toggleLike = true;
        return [...currentRepositories];
      });
    });
  }

  function techNameEntry(name) {
    setTechNames((currentTechNames) => [...currentTechNames, name]);
  }

  function techNameRemove(name) {
    setTechNames((currentTechNames) =>
      currentTechNames.filter((techName) => techName !== name)
    );
  }

  return (
    <div id="app">
      <header>
        <h1>Projects</h1>
      </header>
      <div id="app-content">
        <ul data-testid="repository-list" id="repository-list">
          {repositories ? (
            repositories.map((project) => {
              const { techs } = project;
              return (
                <li key={uuid.random()}>
                  <div id="title-likes">
                    <p id="title">{project.title}</p>
                    <div id="likes-icon-number">
                      {project.likes > 0 && (
                        <p id="number-likes">{project.likes}</p>
                      )}
                      <button
                        id="likes"
                        onClick={() => {
                          handleAddLike(project.id);
                        }}
                      >
                        <ThumbUp
                          color={project.toggleLike ? "primary" : "inherit"}
                        />
                      </button>
                    </div>
                  </div>
                  {techs.map((tech) => (
                    <div key={uuid.random()} id="techs">
                      <ArrowRightAlt id="icon" />
                      <p id="tech">{tech}</p>
                    </div>
                  ))}
                  <a id="url" href={project.url}>
                    {project.url}
                  </a>
                  <button
                    id="button-remove"
                    onClick={() => handleRemoveRepository(project.id)}
                  >
                    Remover
                  </button>
                </li>
              );
            })
          ) : (
            <div></div>
          )}
        </ul>
        <div id="entry-content">
          <table>
            <thead>
              <tr id="table-header">
                <td colSpan="2" align="center">
                  <h3>ADD A REPOSITORY</h3>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr className="entry-item">
                <td className="td-label" align="right">
                  <label htmlFor="name-entry">Name</label>
                </td>
                <td>
                  <input
                    id="name-entry"
                    type="text"
                    value={nameEntry}
                    onChange={(event) => {
                      setNameEntry(event.target.value);
                    }}
                  />
                </td>
              </tr>

              <tr className="entry-item">
                <td className="td-label" align="right">
                  <label htmlFor="url-entry">Url</label>
                </td>
                <td>
                  <input
                    id="url-entry"
                    type="text"
                    value={urlEntry}
                    onChange={(event) => {
                      setUrlEntry(event.target.value);
                    }}
                  />
                </td>
              </tr>

              {techs &&
                Object.keys(techs).map(
                  (elementName) => techs[elementName] && techs[elementName]
                )}
            </tbody>
          </table>

          <table>
            <tbody>
              <tr id="buttons">
                {techs && techs.length > 1 && (
                  <td colSpan="2" align="center">
                    <button id="remove-icon" onClick={() => removeSelf()}>
                      <RemoveCircleOutlineOutlined fontSize="small" />
                    </button>
                  </td>
                )}

                <td>
                  <button
                    id="add-button"
                    onClick={() => {
                      addTech();
                    }}
                  >
                    <Add fontSize="small" />
                  </button>
                </td>
              </tr>

              <tr>
                <td colSpan="2" align="center">
                  <button
                    id=""
                    onClick={() => {
                      handleAddRepository(urlEntry, nameEntry, techNames);
                    }}
                  >
                    Adicionar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
