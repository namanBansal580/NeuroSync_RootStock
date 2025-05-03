
"use client"
import { ChatInterface,Web3Provider} from "./components/ChatComponents";
import BG from "../../../public/10001.svg"
const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-app-dark overflow-hidden  mt-16">
      <img src={BG.src} className="absolute h-[170vh] right-[70vh] top-20"  />

      <Web3Provider>
        <ChatInterface></ChatInterface>
      </Web3Provider>
       
    </div>
  );
};

export default Index;