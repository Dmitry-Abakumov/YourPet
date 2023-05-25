import * as toasty from '../../shared/toastify/toastify';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { useSelector, useDispatch } from 'react-redux';
import ClockIcon from '../images/icons/ClockIcon';
import FemaleIcon from '../images/icons/FemaleIcon';
import LocationIcon from '../images/icons/LocationIcon';
import HeartIcon from '../images/icons/HeartIcon';
import TrashIcon from '../images/icons/TrashIcon';
import MaleIcon from '../images/icons/MaleIcon';
import { useState } from 'react';
import Button from '../ButtonNotices/ButtonNotices';
import { isUserLogin } from '../../redux/auth/auth-selectors';
import useToggleModalWindow from '../../hooks/useToggleModalWindow';
import useToggleModalApproveAction from '../../hooks/useToggleModalModalApproveAction';
import Modal from '../Modal/Modal';
import ModalApproveAction from '../ModalApproveAction/ModalApproveAction';
import {  getUserId } from '../../redux/auth/auth-selectors';
import {
  fetchAddToFavorite,
  fetchRemoveFromFavorite,
  fetchDeleteNotice,
} from '../../redux/notices/noticesOperations';
import ModalNotice from '../ModalNotice/ModalNotice';
import css from './notice-categories-item.module.css';

const NoticeCategoryItem = ({
  _id,
  noticeAvatar,
  category,
  title,
  location,
  dateOfBirth,
  sex,
  comments,
  breed,
  ownerNotice,
  namePet,
  price,
}) => {
  const isLoggedIn = useSelector(isUserLogin);

  const userId = useSelector(getUserId);
  console.log(userId);
  const data = {
    _id: _id,
    noticeAvatar: noticeAvatar,
    category: category,
    title: title,
    location: location,
    dateOfBirth: dateOfBirth,
    sex: sex,
    comments: comments,
    breed: breed,
    ownerNotice: ownerNotice,
    namePet: namePet,
    price: price,
  };

  // const user = useSelector(getUser);
  // const copy = Object.assign({}, userId);
  // const { user: { favorite: fav, _id: idd}} = copy;
  // console.log(fav);
  // console.log(idd);
  const [currentNotice, setCurrentNotice] = useState({});
  const dispatch = useDispatch();
  const { isModalOpen, openModal, closeModal } = useToggleModalWindow();
  const { isModalOpenApprove, openModalApprove, closeModalApprove } =
    useToggleModalApproveAction();


  // const date = new Date();
  // const thisYear = Number(date.getFullYear());
  // const age = Number(dateOfBirth.slice(6, 10) - thisYear);
  function getAge(dateOfBirth) {
    const ymdArr = dateOfBirth.split('.').map(Number).reverse();
    ymdArr[1]--;
    const bornDate = new Date(...ymdArr);
    const now = new Date();
    const leapYears = (now.getFullYear() - ymdArr[0]) / 4;
    now.setDate(now.getDate() - Math.floor(leapYears));
    const nowAsTimestamp = now.getTime();
    const bornDateAsTimestamp = bornDate.getTime();
    const ageAsTimestamp = nowAsTimestamp - bornDateAsTimestamp;
    const oneYearInMs = 3.17098e-11;
    const age = Math.floor(ageAsTimestamp * oneYearInMs);
    return age;
  }
  const age = getAge(dateOfBirth);

  const btnAddToFavorite = () => {
    Notify.failure('You need authorization');
  };

  const handleFavoriteToggle = async () => {
  console.log(userId);
  // const copy = Object.assign({}, userId);
  const { user: { favorite: fav }} = userId;
  console.log(fav);
  // console.log(idd);
    // if (!isLoggedIn) return toasty.toastInfo('You must be logged in');
    if (fav.includes(_id)) {
      try {
        dispatch(fetchRemoveFromFavorite(_id));
        toasty.toastSuccess('remove from favorite');

        return;
      } catch (e) {
        toasty.toastError(e.message);
      }
    } else {
      try {
        dispatch(fetchAddToFavorite(_id));
        toasty.toastSuccess('add to favorite');

        return;
      } catch (e) {
        toasty.toastError(e.message);
      }
    }
  };
  const checkFavorite = _id => {
    const { user: { favorite: fav}} = userId;
    if (fav.includes(_id)) {
  
      return true;
    }
    return false;
  };
  const checkOwner = ownerNotice => {
    const { user: { _id: idd}} = userId;
    if (ownerNotice === idd) {
      return true;
    }
    return false;
  };
  const handleDelete = _id => {
    dispatch(fetchDeleteNotice(_id));
    toasty.toastSuccess('Deleted successful');
  };

  const getCategoryNotice = category => {
    if (category === 'for-free') {
      category = 'in good hands';
    }
    if (category === 'lost-found') {
      category = 'lost/found';
    }
    return category;
  };

  return (
    <li key={_id} className={css.listItems}>
      <div className={css.imageThumb}>
        <img
          className={css.photoAnimal}
          src={noticeAvatar}
          alt={title}
          width="280"
        />
        <div className={css.topBlock}>
          <p className={css.categoryInfo}>{getCategoryNotice(category)}</p>
          {!isLoggedIn && (
            <Button
              onClick={() => btnAddToFavorite(_id)}
              className={css.topBtn}
              SVGComponent={() => <HeartIcon className={css.icons} />}
            />
          )}
          {isLoggedIn && (
            <div>
              <Button
                onClick={handleFavoriteToggle}
                className={css.topBtn}
                SVGComponent={() => (
                  <HeartIcon
                    className={
                      checkFavorite(_id)
                        ? `${css.icons} ${css.favoriteIcon}`
                        : css.icons
                    }
                  />
                )}
              />
              {checkOwner(ownerNotice) && (
                <Button
                  onClick={openModalApprove}
                  className={css.topBtn}
                  SVGComponent={() => <TrashIcon color="#54ADFF" />}
                />
              )}
              {isModalOpenApprove && (
                <ModalApproveAction
                  closeModal={closeModalApprove}
                  handleDelete={handleDelete}
                  _id={_id}
                  title={title}
                />
              )}
            </div>
          )}
        </div>
        <div className={css.infoCardBlock}>
          <p className={css.noticeInfo}>
            <LocationIcon className={css.icon} color="#54ADFF" />
            {location}
          </p>
          <p className={css.noticeInfo}>
            <ClockIcon className={css.icon} color="#54ADFF" />
            {age === 0 ? '1 year' : `${age} years`}
          </p>
          <p className={css.noticeInfo}>
            {sex.toLowerCase() === 'male' && (
              <MaleIcon className={css.icon} color="#54ADFF" />
            )}
            {sex.toLowerCase() === 'female' && (
              <FemaleIcon className={css.icon} color="#54ADFF" />
            )}
            {sex}
          </p>
        </div>
      </div>
      <div className={css.noticeDesc}>
        <h3 className={css.noticeTitle}>{title}</h3>
        <Button
          className={css.learnBtn}
          onClick={() => {
            console.log(data);
            setCurrentNotice(data);
            console.log(currentNotice);
            openModal();
          }}
        >
          Learn more
        </Button>
        {isModalOpen && (
          <Modal closeModal={closeModal}>
            <ModalNotice {...currentNotice} />
          </Modal>
        )}
      </div>
    </li>
  );
};
export default NoticeCategoryItem;
