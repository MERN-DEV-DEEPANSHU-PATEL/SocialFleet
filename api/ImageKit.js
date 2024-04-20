import ImageKit from "imagekit";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const publicKey = process.env.IMAGE_KIT_PUBLIC_KEY;
const privateKey = process.env.IMAGE_KIT_PRIVATE_KEY;
const urlEndpoint = process.env.IMAGE_KIT_URLENDPOINT;

export const imagekit = new ImageKit({
  publicKey,
  privateKey,
  urlEndpoint,
});

export const getToken = async () => {
  const authenticationParameters = await imagekit.getAuthenticationParameters();
  console.log("authenticationParameters", authenticationParameters);
  return authenticationParameters;
};

export const uploadImageToCDN = async (image) => {
  try {
    image.buffer = fs.readFileSync(image.path);

    const response = await imagekit.upload({
      file: image.buffer, //required
      fileName: image.originalname, //required
    });
    fs.unlinkSync(image.path);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const deleteBulkImageFromCDN = async (arrayOfId) => {
  try {
    const response = await imagekit.bulkDeleteFiles(arrayOfId);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

export const deleteImageFromCDN = async (fileId) => {
  try {
    const response = await imagekit.deleteFile(fileId);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const uploadimage = async (req, res) => {
  try {
    const resa = await uploadImageToCDN(req.body.image, "1.jpg");
    return res.send({ userId: req.user.userId, ...resa });
  } catch (error) {}
};
