import tw from "tailwind-styled-components";

const Containing = tw.div`
flex
items-center
justify-center
text-red-600
bg-gray-200
text-2xl
mt-10
color:white
`;

const Hi = () => {
  return <Containing>hello there gents !</Containing>;
};

export default Hi;
