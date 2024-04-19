import React from "react";

const Img = ({ src, isDefault, className }) => {
  return isDefault ? (
    <img className={className} src={src} alt="Image" />
  ) : (
    <img className={className} src={import.meta.env.VITE_CDN_BASE_URL + src} />
  );
};

export default Img;
