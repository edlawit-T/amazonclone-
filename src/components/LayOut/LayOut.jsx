import Header from "../Header/Header";

const LayOut = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default LayOut;
