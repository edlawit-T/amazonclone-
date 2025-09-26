import CarouselEffect from "../../components/Carousel/CarouselEffect";
import Product from "../../components/Product/Product";
import LayOut from "../../components/LayOut/LayOut";
import Category from "../../components/Category/Category";
const Landing = () => {
  return (
    <LayOut>
      <CarouselEffect />
      <Category/>
      <Product />
    </LayOut>
  );
};

export default Landing;
