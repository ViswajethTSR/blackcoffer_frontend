import React, { useEffect, useState } from 'react';
import { fetchData } from '../api/fetch_api';
import Filters from './filters';
import IntensityChart from './charts/intensity_charts';
import LikelihoodChart from './charts/likelyhood_charts';
import RelevanceChart from './charts/relevance_charts';
import YearChart from './charts/year_charts';
import './dashboard.css';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    endYear: null,
    topics: null,
    sector: null,
    region: null,
    pest: null,
    source: null,
    country: null,
    // city: null,
  });

  useEffect(() => {
    const getData = async () => {
      const result = await fetchData();
      setData(result);
    };

    getData();
  }, []);

  const applyFilters = (data, filters) => {
    return data.filter(item => {
      return (
        (!filters.endYear || item.end_year === filters.endYear) &&
        (!filters.topics || item.topic === filters.topics) &&
        (!filters.sector || item.sector === filters.sector) &&
        (!filters.region || item.region === filters.region) &&
        (!filters.pest || item.pestle === filters.pest) &&
        (!filters.source || item.source === filters.source) &&
        (!filters.country || item.country === filters.country)
        // (!filters.city || item.city === filters.city)
      );
    });
  };

  const filteredData = applyFilters(data, filters);

  const getUniqueOptions = (key) => {
    const options = [...new Set(data.map(item => item[key]))].map(option => ({ value: option, label: option }));
    return options;
  };

  const categorizeSwotData = (data) => {
    const categories = { Strengths: [], Weaknesses: [], Opportunities: [], Threats: [] };
    data.forEach(item => {
      if (item.impact === 'High' || item.likelihood >3) {
        categories.Strengths.push(item);
      } else if (item.impact === 'Low' || item.likelihood < 2) {
        categories.Weaknesses.push(item);
      } else if (item.relevance > 5) {
        categories.Opportunities.push(item);
      } else {
        categories.Threats.push(item);
      }
    });
    return categories;
  };

  const swotData = categorizeSwotData(filteredData);

  const options = {
    endYear: getUniqueOptions('end_year'),
    topics: getUniqueOptions('topic'),
    sector: getUniqueOptions('sector'),
    region: getUniqueOptions('region'),
    pest: getUniqueOptions('pestle'),
    source: getUniqueOptions('source'),
    country: getUniqueOptions('country'),
    // city: getUniqueOptions('city'),
  };

  return (
    <div>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Data Dashboard</h1>
          <p>Visualize and filter data effectively</p>
        </div>
        <div className="dashboard-filters">
          <Filters filters={filters} setFilters={setFilters} options={options} />
        </div>
        <div className="dashboard-charts">
          <div className="chart-card">
            <IntensityChart data={filteredData} />
          </div>
          <div className="chart-card">
            <LikelihoodChart data={filteredData} />
          </div>
          <div className="chart-card">
            <RelevanceChart data={filteredData} />
          </div>
          <div className="chart-card">
            <YearChart data={filteredData} />
          </div>
        </div>
      </div>
      <div className="swot-analysis" style={{justifyContent:'center'}}>
        <h2>SWOT Analysis</h2>
        <div className="swot-grid">
          {Object.keys(swotData).map(category => (
            <div key={category} className={`swot-card ${category.toLowerCase()}`}>
              <h3>{category}</h3>
              <ul>
                {swotData[category].map((item, index) => (
                  <li key={index}>
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      {item.title}
                    </a>
                    <p>{item.insight}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
