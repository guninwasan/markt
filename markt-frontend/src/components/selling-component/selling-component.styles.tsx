import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 5px rgba(51, 51, 51, 0.1); }
  50% { box-shadow: 0 0 15px rgba(51, 51, 51, 0.3); }
  100% { box-shadow: 0 0 5px rgba(51, 51, 51, 0.1); }
`;

const SellingFormContainer = styled.div`
  width: 75%;
  min-width: 300px;
  max-width: 1200px;
  margin: 20px auto;
  padding: 30px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  animation: ${fadeIn} 0.5s ease;
`;

const SectionHeader = styled.h2`
  font-size: 1.8em;
  color: grey;
  padding-bottom: 10px;
  border-bottom: 2px solid #ddd;
  margin-top: 30px;
`;

const FormGroup = styled.div`
  margin-bottom: 25px;
  display: flex;
  flex-direction: column;
`;

const FormRow = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
`;

const TextInput = styled.input`
  width: 90%;
  padding: 14px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  transition: all 0.3s;
  &:focus {
    outline: none;
    border-color: #0066cc;
    box-shadow: 0 0 5px rgba(0, 102, 204, 0.3);
  }
`;

const TextArea = styled.textarea`
  width: 90%;
  padding: 14px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  min-height: 100px;
  transition: all 0.3s;
  &:focus {
    outline: none;
    border-color: #0066cc;
    box-shadow: 0 0 5px rgba(0, 102, 204, 0.3);
  }
`;

const AddMediaButton = styled.button`
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  color: #000000;
  border: 2px dashed #000000;
  border-radius: 8px;
  background: #f9f9f9;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  &:hover {
    background: #eef6ff;
  }
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
`;

const Tag = styled.span<{ selected?: boolean }>`
  padding: 8px 16px;
  font-size: 0.9em;
  border-radius: 6px;
  cursor: pointer;
  background-color: ${({ selected }) => (selected ? "#0066cc" : "#f0f0f0")};
  color: ${({ selected }) => (selected ? "#fff" : "#333")};
  transition: background-color 0.3s;
  &:hover {
    background-color: ${({ selected }) => (selected ? "#005bb5" : "#ddd")};
  }
`;

const Button = styled.button`
  display: block;
  width: 100%;
  padding: 16px;
  font-size: 18px;
  font-weight: bold;
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  animation: ${pulse} 1.5s infinite;
  transition: background-color 0.3s;
  &:hover {
    background-color: #555;
  }
`;

export {
  SellingFormContainer,
  SectionHeader,
  FormGroup,
  FormRow,
  Label,
  TextInput,
  TextArea,
  AddMediaButton,
  TagContainer,
  Tag,
  Button,
};
