import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom/dist';

import UserPage from '../UserPage/UserPage';
import Modal from './RegisterForm/RegisterModal/Modal';

import { signup } from '../../redux/auth/auth-operations';

import RegisterForm from './RegisterForm/RegisterForm';
import Container from 'components/Container/Container';
import css from './register-page.module.css';
import styles from './RegisterForm/RegisterModal/modal.module.scss';
import pawprint from 'images/pawprint.svg';

const RegisterPage = () => {
  const [modalActive, setModalActive] = useState(false);

  const dispatch = useDispatch();

  const handleSignup = data => {
    const { email, password, confirmPassword } = data;
    const dataSent = { email, password };
    // console.log(data);
    // setModalActive(true);
    // Check password and confirmPassword (boolean)
    // console.log(password, confirmPassword);
    if (password !== confirmPassword)
      return alert('confirmPassword must match the password');

    const sendData = async () => {
      try {
        const result = await dispatch(signup(dataSent));
        // console.log(result);
        const { payload } = result;
        if (payload.email || payload.token) {
          setModalActive(true);
          localStorage.setItem('user', JSON.stringify(payload));
        }
        if (payload.status === 409) return alert('Email in use');
      } catch ({ response }) {
        // console.log(response.error.message);
      }
    };
    sendData();
  };

  return (
    <Container>
      {modalActive && <UserPage />}
      {/* <div className={styles.modal}> */}
      <Modal active={modalActive} setActive={setModalActive}>
        <h2 className={styles.modal__header}>Congrats!</h2>
        <h3 className={styles.modal_title}> Youre registration is success</h3>
        <button className={styles.modal_button}>
          <div className={styles.modal_button_items}>
            <NavLink to="/user" className={styles.modal__button_text}>
              Go to profile
            </NavLink>
            <img src={pawprint} alt="pawprint" />
          </div>
        </button>
      </Modal>
      {/* </div> */}
      <div className={css.div}>
        <RegisterForm onSubmit={handleSignup} />
      </div>
    </Container>
  );
};

export default RegisterPage;
