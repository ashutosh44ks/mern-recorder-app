import { useNavigate } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const navigate = useNavigate();
  const logout = async () => {
    try {
      const { data } = await axios.delete("http://localhost:3001/api/auth/logout");
      console.log(data);
      localStorage.removeItem("mern-record-user");
      navigate("/login");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="flex justify-between items-center card">
      <h1 className="text-xl font-medium">Recording Page</h1>
      <button className="btn-primary" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default Header;
