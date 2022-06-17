import styled from "styled-components";
import tw from "tailwind-styled-components";

const Straightner = tw.div`
flex
items-center
justify-center
text-blue-600
bg-neutral-800
text-5xl
mt-10
color:white
`;

const Contained = styled.div`
  flex-direction: column;
  border: 1px solid red;
  margin-top: 50px;
  font-size: 50px;
`;

const Hello = () => {
  return (
    <>
      <Contained>Interesing Test</Contained>
      <Straightner> testing, attention please</Straightner>
    </>
  );
};

export default Hello;
