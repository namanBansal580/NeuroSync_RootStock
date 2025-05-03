import Image from "next/image";
import HeroSection from "./components/Home/HeroSection";
import ThirdSection from "./components/Home/ThirdSection";
import FourthSection from "./components/Home/FourthSection/FourthSection";
import NewsSlider from "./components/Home/NewsSlider/NewsSlider";
import SupportedChains from "./components/Home/SupportedChains";

export default function Home() {
  return (
 <div className="">
 <HeroSection></HeroSection>
 <ThirdSection></ThirdSection>
 <FourthSection></FourthSection>
 <SupportedChains></SupportedChains>
 <NewsSlider></NewsSlider>
 </div>
  );
}
