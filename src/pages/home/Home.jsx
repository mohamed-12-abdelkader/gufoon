import React from "react";
import SectionOne from "../../components/home/SectionOne";
import SectionTwo from "../../components/home/SectionTwo";
import SectionThree from "../../components/home/SectionThree";
import SectionFour from "../../components/home/SectionFour";
import GitGlassesProduct from "../../Hook/user/GitGlassesProduct";

const Home = () => {
  const [glasses, glassesLoading] = GitGlassesProduct();
  console.log(glasses);
  return (
    <div>
      <SectionOne />
      <SectionTwo />
      <SectionThree />
      <SectionFour />
    </div>
  );
};

export default Home;
