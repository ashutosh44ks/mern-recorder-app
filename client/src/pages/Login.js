import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = { name, email };
    try {
      const { data } = await axios.post(
        "http://localhost:3001/api/auth/login",
        user
      );
      localStorage.setItem("mern-record-user", JSON.stringify(data));
      navigate("/");
    } catch (e) {
      console.log(e);
      setError(e.response.data.msg);
    }
  };
  return (
    <div className="min-h-screen min-w-screen flex justify-center items-center bg-slate-200">
      <div className="card">
        <h1 className="text-xl font-medium mb-6 mt-2 text-center">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="my-4 flex gap-2 items-center">
            <div className="min-w-[3rem]">Name</div>
            <input
              type="text"
              className="w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="my-4 flex gap-2 items-center">
            <div className="min-w-[3rem]">Email</div>
            <input
              type="email"
              className="w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <button className="btn btn-primary w-full my-4" type="submit">
              Login
            </button>
          </div>
          {error && <span className="text-sm text-red-500">{error}</span>}
        </form>
      </div>
    </div>
  );
};

export default Login;
