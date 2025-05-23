import styled, { keyframes } from "styled-components";
import { colors } from "../../utils";

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
  background-color: ${colors.lightWhite};
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  animation: ${fadeIn} 0.5s ease;
  overflow: hidden;
`;

const SectionHeader = styled.h2`
  font-size: 1.8em;
  color: grey;
  padding-bottom: 10px;
  border-bottom: 2px solid ${colors.lightGrey};
  margin-top: 30px;
`;

const FormGroup = styled.div`
  margin-bottom: 25px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const FormRow = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 8px;
  color: ${colors.textBlack};
`;

const DropDown = styled.select`
  width: 90%;
  padding: 14px;
  font-size: 16px;
  border: 1px solid ${colors.lightGrey};
  border-radius: 8px;
  transition: all 0.3s;
  &:focus {
    outline: none;
    border-color: #0066cc;
    box-shadow: 0 0 5px rgba(0, 102, 204, 0.3);
  }
`;

const TextInput = styled.input`
  width: 90%;
  padding: 14px;
  font-size: 16px;
  border: 1px solid ${colors.lightGrey};
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
  border: 1px solid ${colors.lightGrey};
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
  color: ${colors.textBlack};
  border: 2px dashed ${colors.textBlack};
  border-radius: 8px;
  background: ${colors.white};
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  &:hover {
    background: ${colors.darkGrey};
    color: ${colors.lightGrey};
    border: 2px dashed ${colors.grey};
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
  background-color: ${({ selected }) =>
    selected ? colors.textBlack : colors.lightGrey};
  color: ${({ selected }) => (selected ? colors.lightWhite : colors.textBlack)};
  transition: background-color 0.3s;
  &:hover {
    background-color: ${({ selected }) =>
      selected ? colors.darkGrey : colors.grey};
  }
`;

const Button = styled.button`
  display: block;
  width: 100%;
  padding: 16px;
  font-size: 18px;
  font-weight: bold;
  background-color: ${colors.black};
  color: ${colors.lightWhite};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  animation: ${pulse} 1.5s infinite;
  transition: background-color 0.3s;
  &:hover {
    background-color: ${colors.darkGrey};
  }
`;

const PreviewImagesContainer = styled.div`
  display: flex;
  margin: 1rem 0;
`;

const StyledImage = styled.img`
  width: 100px;
  height: auto;
  border-radius: 6px;
  display: block;
`;

const StyledVideo = styled.video`
  width: 100px;
  height: auto;
  border-radius: 6px;
  display: block;
`;

const RemoveButton = styled.button`
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: white;
  background-color: ${colors.red};
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: ${colors.redHover};
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
  PreviewImagesContainer,
  RemoveButton,
  StyledImage,
  StyledVideo,
  DropDown,
};
