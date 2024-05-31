import React, { useEffect } from 'react';
import * as d3 from 'd3';

const RelevanceChart = ({ data }) => {
  useEffect(() => {
    const svg = d3.select('#relevanceChart');
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 100, left: 40 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const x = d3.scaleBand()
      .domain(data.map(d => d.country))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.relevance)])
      .nice()
      .range([height, 0]);

    const svgContainer = svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const bars = svgContainer.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.country))
      .attr('y', height)
      .attr('width', x.bandwidth())
      .attr('height', 0)
      .attr('fill', 'lightgreen') // Changed fill color
      .attr('stroke', 'green') // Added border color
      .attr('stroke-width', 1) // Added border width
      .on('mouseover', (event, d) => {
        d3.select('#tooltip')
          .style('left', `${event.pageX + 5}px`)
          .style('top', `${event.pageY - 28}px`)
          .style('opacity', 1)
          .html(`Country: ${d.country}<br>Relevance: ${d.relevance}`);
      })
      .on('mouseout', () => {
        d3.select('#tooltip')
          .style('opacity', 0);
      });

    bars.transition()
      .duration(1000)
      .attr('y', d => y(d.relevance))
      .attr('height', d => height - y(d.relevance));

    svgContainer.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(90)')
      .attr('x', 9)
      .attr('y', 0)
      .attr('dy', '.35em')
      .style('text-anchor', 'start')
      .style('font-size', '10px'); // Added font size for axis labels

    svgContainer.append('g')
      .call(d3.axisLeft(y))
      .selectAll('text')
      .style('font-size', '10px'); // Added font size for axis labels

    svgContainer.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom)
      .attr('text-anchor', 'middle')
      .text('Country')
      .style('font-size', '12px'); // Added font size for axis labels

    svgContainer.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .attr('text-anchor', 'middle')
      .text('Relevance')
      .style('font-size', '12px'); // Added font size for axis labels
  }, [data]);

  return (
    <div>
      <h3 style={{ textAlign: 'center' }}>Relevance by Country</h3>
      <svg id="relevanceChart"></svg>
      <div id="tooltip" style={{ position: 'absolute', textAlign: 'center', width: '120px', height: '28px', padding: '2px', fontSize: '12px', background: 'lightsteelblue', border: '0px', borderRadius: '8px', pointerEvents: 'none', opacity: 0 }}></div>
    </div>
  );
};

export default RelevanceChart;
