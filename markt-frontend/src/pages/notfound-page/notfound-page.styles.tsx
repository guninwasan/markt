import styled from "styled-components";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  text-align: center;
  padding: 2rem;
  background-color: #f9f9f9;
  overflow: hidden;
`;

const NotFoundHeading = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
`;

const Message = styled.p`
  font-size: 1.5rem;
  color: #555;
  margin-bottom: 2rem;
`;

const GameContainer = styled.div`
  width: 600px;
  height: 400px;
  max-width: 100%;
  border: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  overflow: hidden;
`;

export { PageContainer, NotFoundHeading, Message, GameContainer };
