import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Navbaros() {
    return (
        <div>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Container>
                    <Navbar.Brand href="">
                        <img
                            src="/LogoRoofPi.png" // Change this to the path of your image
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                            alt="RoofPi logo"
                        />
                        RoofPi
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/">Home</Nav.Link>
                            <Nav.Link href="/automations">Automations</Nav.Link>
                            <Nav.Link href="/manualctrls">Manual Controls</Nav.Link>
                            <Nav.Link href="/settings">Settings</Nav.Link>
                            <Nav.Link href="/About">About</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
}

export default Navbaros;
