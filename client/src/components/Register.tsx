import { useNavigate } from "react-router-dom";

interface RegisterProps {
  username: string;
  setUsername: (username: string) => void;
  password: string;
  setPassword: (password: string) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const ROOT_API_URL = import.meta.env.VITE_ROOT_API_URL;

const Register = ({
  username,
  setUsername,
  password,
  setPassword,
  setIsLoggedIn,
}: RegisterProps) => {
  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${ROOT_API_URL}/signUp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        setIsLoggedIn(true);
        navigate("/");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      alert("Internal server error");
      console.error(err);
    }
  };

  const navigate = useNavigate();

  return (
    <form
      className="border p-10  mt-[30%] rounded shadow flex flex-col gap-2"
      onSubmit={(e) => handleRegistration(e)}
    >
      <h1 className="text-center text-xl my-3">Sign Up</h1>
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
      <div className="flex gap-2 my-6 justify-center">
        <button
          type="submit"
          className="py-2 w-[50%] rounded bg-blue-300 "
          onClick={() => navigate("/")}
        >
          Register
        </button>
      </div>
    </form>
  );
};

export default Register;
