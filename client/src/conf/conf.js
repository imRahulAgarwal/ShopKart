import { Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const apiUrl = String(import.meta.env.VITE_API_URL);
const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    progress: undefined,
    theme: "light",
    transition: Slide,
};
export { apiUrl, toastOptions };
