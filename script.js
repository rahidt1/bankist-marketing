'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const navLinks = document.querySelector('.nav__links');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();

  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Scrolling

btnScrollTo.addEventListener('click', function () {
  // Old way
  /*
  const s1Cords = section1.getBoundingClientRect();
  window.scrollTo({
    left: s1Cords.left + window.pageXOffset,
    top: s1Cords.top + window.pageYOffset,
    behavior: 'smooth',
  });
  */

  // Modern way
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Page Navigation
// Inefficient
/*
const navLink = document.querySelectorAll('.nav__link');
navLink.forEach(function (el) {
  el.addEventListener('click', function (e) {
    e.preventDefault();
    const id = document.querySelector(this.getAttribute('href'));

    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
});
*/

// Efficient
navLinks.addEventListener('click', function (e) {
  e.preventDefault();
  // Matching strategy for ignoring click that are not nav link
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});
