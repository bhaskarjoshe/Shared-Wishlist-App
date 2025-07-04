import { useNavigate } from "react-router-dom";

interface LogoutProps {
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}


const Logout = ({setIsLoggedIn}: LogoutProps) => {
    const navigate = useNavigate()

    const handleLogout = ()=>{
        localStorage.removeItem("token")
        setIsLoggedIn(false)
        navigate('/login')
    }

  return (
    <button className="fixed top-3 right-3 shadow p-2 rounded bg-red-300 cursor-pointer" onClick={handleLogout}>Logout</button>
  )
}

export default Logout