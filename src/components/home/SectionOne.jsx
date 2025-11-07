import Carousel from "react-bootstrap/Carousel";

const SectionOne = () => {
  return (
    <Carousel className='mt-[0px]'>
      <Carousel.Item>
        <img
          src='1ca2f997-ae86-4d81-ac25-f13540de531a.jpg'
          style={{ height: "400px", width: "100%", margin: "auto" }}
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          src='9ef30d56-1f51-496d-96e1-460db5c051e5.jpg'
          style={{ height: "400px", width: "100%", margin: "auto" }}
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          src='4999c4b6-05ae-44c2-adae-cdfaeb883514.jpg'
          style={{ height: "400px", width: "100%", margin: "auto" }}
        />
      </Carousel.Item>
    </Carousel>
  );
};

export default SectionOne;
