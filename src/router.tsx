import { createRoutesFromElements, Route } from 'react-router-dom';
import Layout from './layout';

const routes = createRoutesFromElements(
  <Route path="/" element={<Layout />}>

  </Route>
);

export default routes;
