import React from 'react';
import { MONTHS, getYearRange } from '../utils/helpers';

const FilterBar = ({ month, year, onMonthChange, onYearChange, onAddClick }) => {
  const years = getYearRange();

  return (
    <div className="filter-bar">
      <div className="filter-left">
        <select
          className="filter-select"
          value={month}
          onChange={(e) => onMonthChange(Number(e.target.value))}
        >
          {MONTHS.map((m, i) => (
            <option key={i + 1} value={i + 1}>{m}</option>
          ))}
        </select>
        <select
          className="filter-select"
          value={year}
          onChange={(e) => onYearChange(Number(e.target.value))}
        >
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
      <button className="btn btn-primary" onClick={onAddClick}>
        + Add Transaction
      </button>
    </div>
  );
};

export default FilterBar;
