import fetch from 'isomorphic-unfetch';

const production = process.env.NODE_ENV === 'production';
const url = production ? 'https://api.rxviz.com' : 'http://localhost:4000';

const getData = response => {
  if (response.ok) {
    return response.json();
  }

  throw new Error(response.statusText);
};

export const createSnippet = ({ code, timeWindow, snippetIdToDelete }) =>
  fetch(`${url}/snippets`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      code,
      timeWindow,
      snippetIdToDelete
    })
  }).then(getData);

export const getSnippet = id => fetch(`${url}/snippets/${id}`).then(getData);

export const shareSnippet = id =>
  fetch(`${url}/snippets/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      isShared: true
    })
  }).then(getData);
