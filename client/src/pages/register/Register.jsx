import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  RiUserFill,
  RiMailFill,
  RiLockPasswordFill,
  RiUserAddFill,
} from "react-icons/ri";
import "./register.scss";
import axios from "axios";
import Logo from "../../components/Logo";
import { toast } from "react-toastify";
import MailVerify from "../../components/mailVerify/MailVerify";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });
  const [sendOtp, setsendOtp] = useState(false);
  const [err, setErr] = useState(null);
  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const {data} = await axios.get(`http://localhost:8800/api/auth/getotp?email=${inputs.email}&username=${inputs.username}`)
      console.log(data);
      setsendOtp(true)
    } catch (error) {
      toast.error(error.response.data.msg);
    }
  };

  return !sendOtp ? (
    <div className="main-container">
      <div className="register">
        <div className="opacity">
          <Logo h={"150"} />
          <h1>Register</h1>
          <form>
            <div className="form-group">
              <RiUserFill />
              <input
                type="text"
                placeholder="Username"
                name="username"
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <RiMailFill />
              <input
                type="email"
                placeholder="Email"
                name="email"
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <RiLockPasswordFill />
              <input
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <RiUserFill />
              <input
                type="text"
                placeholder="Name"
                name="name"
                onChange={handleChange}
              />
            </div>
            {err && <div className="error">{err}</div>}
            <button onClick={handleClick}>Register</button>
          </form>
          <span className="is-user">
            Already have an account <Link to={"/login"}>Login</Link>{" "}
          </span>
        </div>
      </div>
    </div>
  ) : (
    <MailVerify inputs={inputs} />
  );
};

export default Register;
