import { Link } from "react-router"






function NotFound() {

  return (
    
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-2xl text-white font-extrabold">Erro 404, essa página não existe!</h1>
        <Link className="bg-blue-500 py-2 px-6 rounded mt-15 hover:bg-blue-600 duration-200" to='/'>Voltar</Link>
      </div>
    
  )
}

export default NotFound
