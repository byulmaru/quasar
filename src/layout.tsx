import { Alignment, Button, Navbar } from '@blueprintjs/core';
import { useNavigate, Outlet } from 'react-router-dom';

export default function Layout() {
  const navigate = useNavigate();
  return (
    <>
      <Navbar>
        <Navbar.Group align={Alignment.LEFT}>
          <Navbar.Heading>Kosmo by Planet</Navbar.Heading>
          <Navbar.Divider />
        </Navbar.Group>
        <Navbar.Group align={Alignment.RIGHT}>
          <Button className="bp3-minimal" icon="log-in" text="로그인" onClick={() => navigate('/login')}/>
        </Navbar.Group>
      </Navbar>
      <Outlet/>
    </>
  );
}