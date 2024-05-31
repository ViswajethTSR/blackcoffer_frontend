import React, { useEffect } from 'react';
import * as d3 from 'd3';

const YearChart = ({ data }) => {
  useEffect(() => {
    const svg = d3.select('#yearChart');
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const x = d3.scaleBand()
      .domain(data.map(d => new Date(d.published).getFullYear()))
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.intensity)])
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
      .attr('x', d => x(new Date(d.published).getFullYear()))
      .attr('y', height)
      .attr('width', x.bandwidth())
      .attr('height', 0)
      .attr('fill', 'steelblue')
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .on('mouseover', (event, d) => {
        d3.select('#tooltip')
          .style('left', `${event.pageX + 5}px`)
          .style('top', `${event.pageY - 28}px`)
          .style('opacity', 1)
          .html(`Intensity: ${d.intensity}\nYear:${new Date(d.published).getFullYear()}`);
      })
      .on('mouseout', () => {
        d3.select('#tooltip')
          .style('opacity', 0);
      });

    bars.transition()
      .duration(1000)
      .attr('y', d => y(d.intensity))
      .attr('height', d => height - y(d.intensity));

    svgContainer.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    svgContainer.append('g')
      .call(d3.axisLeft(y));

    svgContainer.append('text')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom)
      .attr('text-anchor', 'middle')
      .text('Year');

    svgContainer.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .attr('text-anchor', 'middle')
      .text('Intensity');
  }, [data]);

  return (
    <div>
      <h3>Intensity by Year</h3>
      <svg id="yearChart"></svg>
      <div id="tooltip" style={{ position: 'absolute', textAlign: 'center', width: '120px', height: '28px', padding: '2px', fontSize: '12px', background: 'lightsteelblue', border: '0px', borderRadius: '8px', pointerEvents: 'none', opacity: 0 }}></div>
    </div>
  );
};

export default YearChart;
