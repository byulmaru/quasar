import { createRoutesFromElements, Route } from 'react-router-dom';
import Layout from './layout';

const routes = createRoutesFromElements(
  <Route path="/" element={<Layout />}>
    <Route path="login" lazy={() => import('./routes/login')} />
  </Route>
);

export default routes;
