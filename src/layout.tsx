import { Alignment, Button, Navbar } from '@blueprintjs/core';
import { useNavigate, Outlet, NavLink } from 'react-router-dom';
import { getSession } from './session';

export default function Layout() {
  const navigate = useNavigate();
  const mainStyle: React.CSSProperties = {
    maxWidth: '800px', 
    margin: '0 auto', 
    padding: '0 5px'
  };
  const session = getSession();
  return (
    <>
      <Navbar>
        <Navbar.Group align={Alignment.LEFT}>
          <Navbar.Heading>
            <NavLink to="/">Quasar by Planet</NavLink>
          </Navbar.Heading>
          <Navbar.Divider />
        </Navbar.Group>
        <Navbar.Group align={Alignment.RIGHT}>
          {
            session ? 
            <Button className="bp5-minimal" icon="user" text={session.acct} /> :
            <Button className="bp5-minimal" icon="log-in" text="로그인" onClick={() => navigate('/login')} />
          }
        </Navbar.Group>
      </Navbar>
      <main style={mainStyle}>
        <Outlet/>
      </main>
    </>
  );
}