import { useNavigate } from "react-router-dom";

const ROOT_API_URL = import.meta.env.VITE_ROOT_API_URL;
interface LoginProps {
  username: string
  setUsername : (username:string) => void
  password: string
  setPassword : (password:string) => void
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const Login = ({ username, setUsername, password, setPassword, setIsLoggedIn }: LoginProps) => {

  const navigate = useNavigate()
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${ROOT_API_URL}/signIn`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const data = await res.json()
      if (res.ok && data.token){
        localStorage.setItem("token", data.token)
        setIsLoggedIn(true)
        navigate('/')
      }else{
        alert(data.message || "Login failed")
      }
    } catch (err) {
      alert("Internal server error")
      console.error(err);
    }
  };

  return (
    <form
      className="border p-10  mt-[30%] rounded shadow flex flex-col gap-2"
      onSubmit={(e) => handleLogin(e)}
    >
      <h1 className="text-center text-xl my-3">Login</h1>
      <label htmlFor="username">Username</label>
      <input
        id="username"
        placeholder="Enter Username"
        className="border p-2 rounded"
        required
        onChange={(e) => setUsername(e.target.value)}
      />
      <label htmlFor="password">Password</label>
      <input
        id="password"
        placeholder="Enter password"
        type="password"
        className="border p-2 rounded"
        required
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="flex gap-2 my-6">
        <button type="submit" className="py-2 w-[50%] rounded bg-blue-300">
          Log In
        </button>
        <button type="button" className="py-2 w-[50%] rounded bg-blue-300 " onClick={()=>navigate('/register')}>
          Sign up
        </button>
      </div>
    </form>
  );
};

export default Login;
