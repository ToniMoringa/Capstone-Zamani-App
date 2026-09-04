import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import '../styles/datepicker.css';

const DatePickerComponent = ({ onDateSelect, initialDate }) => {
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(
    initialDate ? new Date(initialDate) : new Date(),
  );

  const [mode, setMode] = useState('global');

  const handleDateChange = (date) => {
    if (!date) return;

    setSelectedDate(date);

    const formattedDate = date.toISOString().split('T')[0];

    if (onDateSelect) {
      onDateSelect(date);
    }

    navigate(`/capsule/${formattedDate}/${mode}`);
  };

  const CustomInput = ({ value, onClick }) => (
    <button
      type="button"
      className="date-picker-input"
      onClick={onClick}
      aria-label="Select a date"
    >
      <span className="date-icon">📅</span>

      <span className="date-value">{value || 'SELECT DATE'}</span>

      <span className="date-arrow">▼</span>
    </button>
  );

  return (
    <div className="date-picker-container">
      <div className="mode-toggle">
        <button
          type="button"
          className={`mode-btn ${mode === 'global' ? 'active' : ''}`}
          onClick={() => setMode('global')}
          aria-pressed={mode === 'global'}
        >
          🌍 GLOBAL
        </button>

        <button
          type="button"
          className={`mode-btn ${mode === 'kenya' ? 'active' : ''}`}
          onClick={() => setMode('kenya')}
          aria-pressed={mode === 'kenya'}
        >
          🇰🇪 KENYA
        </button>
      </div>

      <div className="picker-wrapper">
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="MMMM d, yyyy"
          maxDate={new Date()}
          minDate={new Date('1900-01-01')}
          customInput={<CustomInput />}
          calendarClassName="retro-calendar"
          popperClassName="retro-popper"
          showPopperArrow={false}
          showYearDropdown
          showMonthDropdown
          dropdownMode="select"
        />
      </div>

      <div className="quick-dates">
        <button
          type="button"
          className="quick-btn"
          onClick={() => handleDateChange(new Date('1963-12-12'))}
        >
          Independence Day
        </button>

        <button
          type="button"
          className="quick-btn"
          onClick={() => handleDateChange(new Date())}
        >
          Today
        </button>
      </div>

      <div className="selected-date-display">
        <p className="display-label">TODAY:</p>

        <p className="display-date">
          {selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>
    </div>
  );
};

export default DatePickerComponent;
