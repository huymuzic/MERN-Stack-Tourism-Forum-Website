import React from 'react';
import './contact-modal.css';
import { useContactModal } from './ContactModalContext';

const ContactModal =  () => {

  const { showModal, handleHideModal } = useContactModal();

  return (
    <div className={`contact__modal ${showModal ? 'visible' : 'hidden'}`}>
      <form className='contact__form'> 
      <span onClick={handleHideModal}><i className="ri-close-large-line"></i></span>
        <h3>GET IN TOUCH</h3>
          <div className="input-group contact__input">
            <input type="text" required />
            <label htmlFor="">Your Name</label>
          </div>
          <div className="input-group contact__input">
            <input type="email" required />
            <label htmlFor="">Email</label>
          </div>
          <div className="input-group contact__input">
            <input type="text" required />
            <label htmlFor="">Phone number</label>
          </div>
         <textarea rows='4' placeholder='How can we help you?' required></textarea>
        <button type='submit'>Send</button>
      </form>
    </div>
  );

};

export default ContactModal;
