import { Outlet } from "react-router-dom"
import LeftSidebar from "./LeftSidebar"


const Mainlayout = () => {
  return (
    <div>
      <LeftSidebar/>
      <Outlet/>
    </div>
  )
}

export default Mainlayout
