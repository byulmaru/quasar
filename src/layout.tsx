import { Alignment, Button, Navbar } from '@blueprintjs/core';
import { useNavigate, Outlet, NavLink } from 'react-router-dom';

export default function Layout() {
  const navigate = useNavigate();
  const mainStyle: React.CSSProperties = {
    maxWidth: '800px', 
    margin: '0 auto', 
    padding: '0 5px'
  };
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
          <Button className="bp3-minimal" icon="log-in" text="로그인" onClick={() => navigate('/login')}/>
        </Navbar.Group>
      </Navbar>
      <main style={mainStyle}>
        <Outlet/>
      </main>
    </>
  );
}