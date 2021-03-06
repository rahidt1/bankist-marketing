'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const header = document.querySelector('.header');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const navLinks = document.querySelector('.nav__links');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

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
    const id = this.getAttribute('href');

    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
});
*/

// Efficient (Event Delegation method)
navLinks.addEventListener('click', function (e) {
  e.preventDefault();
  // Matching strategy (for ignoring click that are not nav link)
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed component (using Event Delegation method)
tabsContainer.addEventListener('click', function (e) {
  // Using closest instead of simply checking classList.contains because it has child element (span) that might be clicked
  const clicked = e.target.closest('.operations__tab');

  // Guard clause
  // closest() method returns null if it does not find desired element, in that case we are exiting from the function
  if (!clicked) return;

  // Remove active classes from all the tab and content
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));

  tabsContent.forEach(content =>
    content.classList.remove('operations__content--active')
  );

  // Add class to Actice tab and content
  clicked.classList.add('operations__tab--active');

  // Alternate method
  /*
  document
    .querySelector(`.operations__content--${clicked.getAttribute('data-tab')}`)
    .classList.add('operations__content--active');
    */
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    // Here 'this' is 0.5/1, because we set it manually using bind method
    logo.style.opacity = this;
  }
};

// Passing "argument" into handler
// Note: In reality we cant really pass argument into handler. We know bind method returns a new function where we can preset 'this'. So we can pass any value in place of 'this' as argument. In case of multiple values, we can pass array in place of 'this'.
// mouseenter/mouseleave dont bubble, so we use mouseover/mouseout

nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// Alternate way (if problem understanding bind())
/*
nav.addEventListener('mouseover', function (e) {
  handleHover(e, 0.5);
});
nav.addEventListener('mouseout', function (e) {
  handleHover(e, 1);
});
*/

// Sticky navigation
// Inefficient
/*
const initialCords = section1.getBoundingClientRect();
window.addEventListener('scroll', function () {
  if (window.scrollY > initialCords.top) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
});
*/

// Sticky navigation (Intersection observer API)
const navHeight = nav.getBoundingClientRect().height;

const headerCallback = function (entries) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
  });
};
const headerOptions = {
  root: null, // whole viewport
  threshold: 0, // as soon as the element moves in or out
  rootMargin: `-${navHeight}px`,
};
const headerObserver = new IntersectionObserver(headerCallback, headerOptions);
headerObserver.observe(header);

// Reveal sections
const allSections = document.querySelectorAll('.section');

const sectionCallback = function (entries, observer) {
  // Destructuring entries
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionOptions = {
  root: null,
  threshold: 0.15, //section is revealed when 15% visible
};

const sectionObserver = new IntersectionObserver(
  sectionCallback,
  sectionOptions
);

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy loading images
const imageTarget = document.querySelectorAll('.features__img');

const imgCallback = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  // Remove blur effect after the img fully loads
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
  console.log(entry);
};

const imgOptions = {
  root: null,
  threshold: 0,
  rootMargin: '200px',
};

const imgObserver = new IntersectionObserver(imgCallback, imgOptions);

imageTarget.forEach(img => imgObserver.observe(img));

// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`));

  let currSlide = 0;

  // Functions
  // Create dots
  const createDots = function () {
    // Running forEach on slides just so we can get the no. of dots = no. of slides
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  // Activate dot
  const activeDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  // Move Slide
  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (currSlide === slides.length - 1) currSlide = 0;
    else currSlide++;

    goToSlide(currSlide);
    activeDot(currSlide);
  };

  // Previous slide
  const prevSlide = function () {
    if (currSlide === 0) currSlide = slides.length - 1;
    else currSlide--;

    goToSlide(currSlide);
    activeDot(currSlide);
  };

  // Initial condition
  const init = function () {
    goToSlide(0);
    createDots();
    activeDot(0);
  };
  init();

  // Event Handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const slide = e.target.dataset.slide;
      goToSlide(slide);
      activeDot(slide);
    }
  });
};
slider();
