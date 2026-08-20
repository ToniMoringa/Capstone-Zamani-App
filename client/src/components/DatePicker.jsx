import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import '../styles/datepicker.css';

/**
 * DatePicker Component
 *
 * A retro-styled date picker that allows users to select a date
 * and navigate to the capsule view. Integrates with react-datepicker
 * but styled to match the ZAMANI retro TV aesthetic.
 *
 * @param {Object} props
 * @param {Function} props.onDateSelect - Callback when date is selected
 * @param {string} props.initialDate - Initial date value (optional)
 */
const DatePickerComponent = ({ onDateSelect, initialDate }) => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(
    initialDate ? new Date(initialDate) : new Date(),
  );
  const [mode, setMode] = useState('global'); // 'global' or 'kenya'

  /**
   * Handle date selection
   * Formats date and navigates to capsule page
   */
  const handleDateChange = (date) => {
    if (date) {
      setSelectedDate(date);

      // Format date as YYYY-MM-DD for URL
      const formattedDate = date.toISOString().split('T')[0];

      // Call parent callback if provided
      if (onDateSelect) {
        onDateSelect(date);
      }

      // Navigate to capsule page with date and mode
      navigate(`/capsule/${formattedDate}/${mode}`);
    }
  };

  /**
   * Custom input component for the date picker
   * Styled to match retro aesthetic
   */
  const CustomInput = ({ value, onClick }) => (
    <button
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
      {/* Mode Toggle */}
      <div className="mode-toggle">
        <button
          className={`mode-btn ${mode === 'global' ? 'active' : ''}`}
          onClick={() => setMode('global')}
          aria-pressed={mode === 'global'}
        >
          🌍 GLOBAL
        </button>
        <button
          className={`mode-btn ${mode === 'kenya' ? 'active' : ''}`}
          onClick={() => setMode('kenya')}
          aria-pressed={mode === 'kenya'}
        >
          🇰🇪 KENYA
        </button>
      </div>

      {/* Date Picker */}
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

      {/* Quick Select Buttons */}
      <div className="quick-dates">
        <button
          className="quick-btn"
          onClick={() => handleDateChange(new Date('1963-12-12'))}
        >
          Independence Day
        </button>
        <button
          className="quick-btn"
          onClick={() => handleDateChange(new Date())}
        >
          Today
        </button>
      </div>

      {/* Selected Date Display */}
      <div className="selected-date-display">
        <p className="display-label">SELECTED:</p>
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
