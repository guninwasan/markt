import styled from 'styled-components';

//FOR FULL STARS

const StarContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 24px; 
  color: #b8adad; 
`;

const FullStarIcon = styled.div`
  color: gold;
  display: inline-block;
  width: 24px;
  height: 24px;
  line-height: 0; 
`;

//FOR PARTIAL STARS

const PartialStarWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 24px; 
  height: 24px; 
  line-height: 0; 
  vertical-align: middle;
`;

const PartialStarIcon = styled.div<{ fillPercentage: number }>`
  color: gold;
  position: absolute;
  top: 0;
  left: 0;
  width: ${({ fillPercentage }) => `${fillPercentage}%`};
  height: 100%; 
  overflow: hidden;
  display: inline-block;
  line-height: 0;
`;

export {StarContainer, PartialStarWrapper, FullStarIcon, PartialStarIcon};