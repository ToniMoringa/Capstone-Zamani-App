import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import TVFrame from '../components/TVFrame';
import DatePickerComponent from '../components/DatePicker';

const CAROUSEL_INTERVAL_MS = 6000;

const HOME_ARCHIVE_SLIDES = [
  {
    src: 'https://publish.eastleighvoice.co.ke/mugera_lock/uploads/2026/07/eastleighvoice-co-ke-2026-july-07-165406.webp',
    alt: 'Saba Saba Protests & Demonstrations',
    title: 'Saba Saba Movement',
    caption: 'Citizen mobilizations in July marking Kenya’s struggle for political expression.',
  },
  {
    src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmRXIVl8WoQnMENkHOuFbOppk2LZRjaWoj1s6r5hlQDxQpNiFZ',
    alt: '1990s Political Reformers',
    title: '1990 Multi-Party Push',
    caption: 'Politicians and activists demanding democratic reform and political pluralism.',
  },
  {
    src: 'https://africa.dailynewsegypt.com/wp-content/uploads/2025/07/WhatsApp-Image-2025-07-09-at-3.35.46-PM-1-768x512.jpeg',
    alt: 'Civil Activism',
    title: 'Voices of Discontent',
    caption: 'Historical civil actions shaping Kenya’s contemporary governance landscape.',
  },
  {
    src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_1IfmeiNfN7-GRuVFn4L1BxwESUQNlnW4fEqWvfjIm0MPAH7866z8wy4&s=10',
    alt: 'Historical Archive Portrait 1',
    title: 'Documented Voices',
    caption: 'Preserved photographs holding testament to nation-building movements.',
  },
  {
    src: 'https://www.quaker.org.uk/media/W1siZiIsIjIwMjIvMDkvMjAvMTEvMDEvMDkvNjE5MTI5OGQtNzE4Mi00ZjliLTljOTUtZTdjNTQ1ZjFjNzYwL1JhY2tNdWx0aXBhcnQyMDIyMDkyMC0xNi0xNGM0bGEzLmpwZyJdLFsicCIsInRodW1iIiwiODIweDEyMDAiXV0',
    alt: 'Clergy & Public Assembly Protection',
    title: 'Religious & Civic Calls',
    caption: 'Religious and civil society groups advocating for citizen constitutional rights.',
  },
  {
    src: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQiAD8eeWlokC_g8-zLHvOmFiAzoYWP_-xk2U_qwnxJqAroFUdH',
    alt: 'Jomo Kenyatta - Kenya’s First President',
    title: 'Mzee Jomo Kenyatta',
    caption: 'Independent Kenya’s first president addressing the public after 1963.',
  },
  {
    src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSx5wLWMxRFTf9lgbHhHox7ZrmPAbo3cbYDDpFgm92waEP53SolB_za9S4e&s=10',
    alt: 'Historical Archive Portrait 2',
    title: 'Moments from the Archive',
    caption: 'Key historical figures during critical turning points in East Africa.',
  },
  {
    src: 'https://fatherlandgazette.com/wp-content/uploads/2021/04/Kiyuku-People.jpeg',
    alt: 'Kikuyu People Heritage Photo',
    title: 'Cultural Foundations',
    caption: 'Cultural life, traditions, and communities that underpin regional history.',
  },
  {
    src: 'https://cdn.britannica.com/07/10507-050-CA3FE190/Jomo-Kenyatta.jpg?w=300',
    alt: 'Jomo Kenyatta Biography Archival Image',
    title: 'Architects of Independence',
    caption: 'Archival photographs capturing leaders of anti-colonial movements.',
  },
  {
    src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkIC-zeUQhMU9ELTzBBx54FctpwIR9pSb6co7d4VJbMJqLvWyOsp_m9owU&s=10',
    alt: 'Historical Document or Portrait',
    title: 'Preserved Heritage',
    caption: 'Colonial Kenya.',
  },
  {
    src: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjcrYuadyPpo8ZiTjvZlSWUR_OIIUa7vFU_4rltZsvu8fm1tYgHHHko1lH&s=10',
    alt: 'Dedan Kimathi Released',
    title: 'Kenyan Heroes',
    caption: 'MauMau brave fighters struggle to free Kenya from colonialism.',
  },
];

const Home = () => {
  const location = useLocation();
  const pickerRef = useRef(null);
  
  const [currentIndex, setCurrentIndex] = useState(0);

  const touchStartY = useRef(0);
  const touchEndY = useRef(0);
  const lastScrollTime = useRef(0);

  useEffect(() => {
    if (location.state?.focusDate) {
      pickerRef.current?.focus();
    }
  }, [location.state]);

  // Fast preloading for immediate slide availability
  useEffect(() => {
    HOME_ARCHIVE_SLIDES.forEach((slide) => {
      const img = new Image();
      img.src = slide.src;
    });
  }, []);

  // Interval timer for carousel auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HOME_ARCHIVE_SLIDES.length);
    }, CAROUSEL_INTERVAL_MS);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index) => {
    const total = HOME_ARCHIVE_SLIDES.length;
    setCurrentIndex((index + total) % total);
  };

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    const diffY = touchStartY.current - touchEndY.current;
    if (Math.abs(diffY) > 30) {
      if (diffY > 0) {
        goToSlide(currentIndex + 1);
      } else {
        goToSlide(currentIndex - 1);
      }
    }
  };

  // Traps scroll wheel inside the placeholder div
  const handleWheel = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const now = Date.now();
    if (now - lastScrollTime.current < 250) return;

    if (e.deltaY > 0) {
      goToSlide(currentIndex + 1);
      lastScrollTime.current = now;
    } else if (e.deltaY < 0) {
      goToSlide(currentIndex - 1);
      lastScrollTime.current = now;
    }
  };

  const activeSlide = HOME_ARCHIVE_SLIDES[currentIndex];

  return (
    <div className="home-page">
      <TVFrame brand="ZAMANI" model="TIME CAPSULE">
        <main className="home-broadcast">
          <section className="home-copy">
            <span className="broadcast-kicker">
              <span className="live-dot" aria-hidden="true" />
              DIGITAL RECOLLECTION CENTRE
            </span>
            <h1>
              TUNE INTO <span>HISTORY</span>
            </h1>
            <p className="home-intro">
              Select any year or historical event to unlock preserved moments, news reels, and personal recollections.
            </p>

            <div className="home-controls-wrapper" ref={pickerRef}>
              <DatePickerComponent />
            </div>
          </section>

          {/* Original outer container preserved */}
          <div 
            className="home-image-placeholder"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
          >
            <div className="carousel-viewport">
              <div 
                className="carousel-vertical-track"
                style={{ transform: `translateY(-${currentIndex * 100}%)` }}
              >
                {HOME_ARCHIVE_SLIDES.map((slide, idx) => (
                  <div className="carousel-slide-item" key={slide.src}>
                    <img
                      src={slide.src}
                      alt={slide.alt}
                      loading={idx === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="carousel-info-overlay">
              <span>
                FRAME {String(currentIndex + 1).padStart(2, '0')} / {String(HOME_ARCHIVE_SLIDES.length).padStart(2, '0')}
              </span>
              <strong>{activeSlide.title}</strong>
              <p>{activeSlide.caption}</p>
            </div>
          </div>
        </main>
      </TVFrame>
    </div>
  );
};

export default Home;