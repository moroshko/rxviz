import Error from '../components/Error';

const error404 = () => {
  const statusCode = 404;

  return <Error statusCode={statusCode} />;
};

export default error404;
