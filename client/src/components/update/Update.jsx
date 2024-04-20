import { useContext, useState } from "react";
import "./update.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import useMakeRequest from "../../hook/useFetch";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/authContext";
import Img from "../Img";
import { uploadImageToCDN } from "../../ImageKit";

const Update = ({ setOpenUpdate, user }) => {
  const [cover, setCover] = useState(null);
  const { setCurrentUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const makeRequest = useMakeRequest();
  const [isLoading, setIsLoading] = useState(false);
  const [texts, setTexts] = useState({
    email: user.email,
    password: user.password,
    name: user.name,
    city: user.city,
    website: user.website,
  });

  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: [e.target.value] }));
  };

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (user) => {
      return makeRequest.put("/users", user).then((res) =>
        res.status === 200
          ? setCurrentUser((prev) => {
              return { ...prev, ...user };
            })
          : ""
      );
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["user"]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let coverUrl;
      let profileUrl;
      coverUrl = cover ? await uploadImageToCDN(cover) : user.coverPic;
      profileUrl = profile ? await uploadImageToCDN(profile) : user.profilePic;

      mutation.mutate({ ...texts, coverPic: coverUrl, profilePic: profileUrl });
      setOpenUpdate(false);
      setCover(null);
      setProfile(null);
    } catch (error) {
      console.log("error while update profile", error);
      toast.error("error while update profile");
    }
    setIsLoading(false);
  };
  return (
    <div className="update">
      <div className="wrapper">
        <h1>Update Your Profile</h1>
        <form>
          <div className="files">
            <label htmlFor="cover">
              <span>Cover Picture</span>
              <div className="imgContainer">
                <Img
                  isDefault={cover ? true : false}
                  src={cover ? URL.createObjectURL(cover) : user.coverPic}
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input
              type="file"
              id="cover"
              style={{ display: "none" }}
              onChange={(e) => setCover(e.target.files[0])}
            />
            <label htmlFor="profile">
              <span>Profile Picture</span>
              <div className="imgContainer">
                <Img
                  isDefault={profile ? true : false}
                  src={profile ? URL.createObjectURL(profile) : user.profilePic}
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input
              type="file"
              id="profile"
              style={{ display: "none" }}
              onChange={(e) => setProfile(e.target.files[0])}
            />
          </div>
          <label>Email</label>
          <input
            type="text"
            value={texts.email}
            name="email"
            onChange={handleChange}
          />
          <label>Password</label>
          <input
            type="text"
            value={texts.password}
            name="password"
            onChange={handleChange}
          />
          <label>Name</label>
          <input
            type="text"
            value={texts.name}
            name="name"
            onChange={handleChange}
          />
          <label>Country / City</label>
          <input
            type="text"
            name="city"
            value={texts.city}
            onChange={handleChange}
          />
          <label>Website</label>
          <input
            type="text"
            name="website"
            value={texts.website}
            onChange={handleChange}
          />
          <button
            disabled={isLoading}
            style={{ cursor: isLoading ? "not-allowed" : "pointer" }}
            onClick={handleClick}
          >
            Update
          </button>
        </form>
        <button className="close" onClick={() => setOpenUpdate(false)}>
          close
        </button>
      </div>
    </div>
  );
};

export default Update;
