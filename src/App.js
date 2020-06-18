import React, { useState, useEffect } from "react";
import api from './services/api';
import { uuid } from 'uuidv4';

import "./styles.css";

function App() {

  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    async function loadResource(){
      const response = await api.get('/repositories');

      setRepositories(response.data);
    }

    loadResource();
  }, []);

  async function handleAddRepository() {
    const response = await api.post('repositories', {
      id: uuid(),
      title: `New Repository ${Date.now()}`,
      url: 'http://github.com',
      techs: ["NodeJS", "ReactJS"],
      likes: 0
    });

    const repository = response.data;

    setRepositories([...repositories, repository]);
  }

  async function handleRemoveRepository(id) {
    const response = await api.delete(`repositories/${id}`);
    
    if(response.status === 204) {
      const newRepositories = repositories.filter(
        repository => repository.id !== id
      );

      setRepositories(newRepositories);
    } else {
      alert('Não foi possível excluir o repositório');
    }
  }

  return (
    <div>
      <ul data-testid="repository-list">
          {
            repositories.map(repository => <li key={repository.id}>
              {repository.title}
              <button onClick={() => handleRemoveRepository(repository.id)}>
                Remover
              </button>
            </li>)
          }          
      </ul>
      <button onClick={handleAddRepository}>Adicionar</button>
    </div>
  );
}

export default App;
