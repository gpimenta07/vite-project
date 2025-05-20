import { RouterProvider } from "react-router"
import router from "./router"


function App() {


  return (
    <div className="bg-zinc-900 w-full min-h-screen">
      <RouterProvider router={router}/>
    </div>
  )
}

export default App
