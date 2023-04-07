import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    border:"none",
    backgroundColor : "rgb(0,0,0,0)",
    width: '100%',
    maxWidth: '40rem',
    fontSize: '1.2rem'
  },
  overlay:{
    zIndex: 50,
    backgroundColor: "rgb(0,0,0,.95)"
  }
};

Modal.setAppElement('#root');

export default function ModalStyled({showModal, modalMessage, setShowModal, setModalMessage}){
 return(   <Modal
        isOpen={showModal}
        style={customStyles}
      >     
      <>
        {!modalMessage ? <p className='text-white load'></p> : modalMessage}

      </>
    

          </Modal>)
}