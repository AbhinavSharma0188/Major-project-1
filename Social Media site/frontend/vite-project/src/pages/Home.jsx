import Feed from "../components/Feed"
import LeftHome from "../components/LeftHome"
import RightHome from "../components/RightHome"

function Home() {
  return (
    <div className="w-full flex justify-center items-center">
        <LeftHome/>
        <Feed/>
        <RightHome/>
    </div>

  )
}

export default Home