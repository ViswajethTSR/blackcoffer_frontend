import React from 'react';
import Select from 'react-select';
import './filter.css';

const Filters = ({ filters, setFilters, options }) => {
  const handleChange = (selectedOption, { name }) => {
    setFilters({ ...filters, [name]: selectedOption ? selectedOption.value : null });
  };

  return (
    <div className="filters-container">
      {Object.keys(options).map(key => (
        <div className="filter-item" key={key}>
          <Select
            name={key}
            options={options[key]}
            isClearable
            placeholder={`Select ${key}`}
            onChange={handleChange}
          />
        </div>
      ))}
    </div>
  );
};

export default Filters;
