import React, {useState} from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
// import { Auth } from 'aws-amplify';


function SignupModal() {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
      <>
        <Button variant="primary" onClick={handleShow}>
          Test sign up
        </Button>
  
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Sign In with Two Clicks</Modal.Title>
          </Modal.Header>
          {/* <Modal.Body>
            <button onClick={() => Auth.federatedSignIn({ provider: 'Google'})}>Sign In with Google</button>
            <button onClick={() => Auth.federatedSignIn({ provider: 'Facebook'})}>Sign In with Facebook</button>
          </Modal.Body> */}
          {/* <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer> */}
        </Modal>
      </>
    );
  }

  export default SignupModal;
  
//   render(<Example />);