import fetch from 'isomorphic-unfetch';

const production = process.env.NODE_ENV === 'production';
const url = production ? 'https://api.rxviz.com' : 'http://localhost:4000';

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
  }).then(response => response.json());

export const getSnippet = id =>
  fetch(`${url}/snippets/${id}`).then(response => response.json());
