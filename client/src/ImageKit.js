import ImageKit from "imagekit-javascript";
import { toast } from "react-toastify";
import axios from "axios";
const imagekit = new ImageKit({
  urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT,
  privateKey: import.meta.env.VITE_IMAGEKIT_PRIVATE_API_KEY,
  publicKey: import.meta.env.VITE_IMAGE_KIT_PUBLIC_KEY,
});

const fetchAuthenticationParameters = async () => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_SERVER_URL}/generate-auth-token`
    );
    return response.data;
  } catch (err) {
    console.error("Error fetching authentication parameters:", err);
    throw err;
  }
};

export const uploadImageToCDN = async (file) => {
  try {
    const authParams = await fetchAuthenticationParameters();
    const uploadResponse = await imagekit.upload({
      file: file,
      fileName: file.name,
      token: authParams.token,
      signature: authParams.signature,
      expire: authParams.expire,
      isPrivateFile: false, // Set to true if you want to make the uploaded file private
      responseFields: ["thumbUrl", "fileId", "name"], // Specify the fields you want to receive in the response
    });
    return uploadResponse.name;
  } catch (err) {
    toast.error(err.message);
    console.log(err);
  }
};
