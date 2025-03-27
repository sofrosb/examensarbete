import { toast } from "react-toastify";

const ToastService = {
  success: (message: string) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 5000,
    });
  },
  warning: (message: string) => {
    toast.warn(message, { position: "top-right", autoClose: 5000 });
  },
  error: (message: string) => {
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
    });
  },
};

export default ToastService;
