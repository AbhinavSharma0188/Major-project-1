import { IoMdArrowRoundBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoopCard from "../components/LoopCard";

function Loops() {
     
    const navigate = useNavigate();
    const {loopData}=useSelector(state=>state.loop)
  return (
    <div className="w-screen h-screen bg-black overflow-hidden flex justify-center items-center">
        <div className="w-full h-[80px] flex items-center gap-[20px] px-[20px] fixed top-[10px] left-[10px]">
                <IoMdArrowRoundBack
                  className="text-white w-[25px] h-[25px] cursor-pointer"
                  onClick={() =>
                    navigate(`/`)
                  }
                />
                <h1 className="text-white font-semibold text-[20px]">Loops</h1>
              </div>
            <div className="h-[100vh] overflow-y-scroll snap-y snap-mandatory scrolllbar-hide">
                 {loopData.map((loop,index)=>(
                     <div className="h-screen snap-start">
                      <LoopCard loop={loop} key={loop._id}/>

                     </div>
                 ))}
            </div>


    </div>
  )
}

export default Loops