import React from "react";
import Img from "../Img";

const Story = ({ imgSrc, username, onClick }) => {
  return (
    <div className="story" onClick={onClick}>
      <Img
        isDefault={imgSrc ? false : true}
        src={imgSrc ? imgSrc : "/user.png"}
      />
      <span>{username}</span>
    </div>
  );
};

export default Story;
