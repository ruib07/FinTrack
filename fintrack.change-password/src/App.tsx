import { FormEvent, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "./components/Button";
import Input from "./components/Input";
import Label from "./components/Label";
import { EyeCloseIcon, EyeIcon } from "./icons";
import { UpdatePassword } from "./services/change-password.service";
import { ChangePassword } from "./types/changePassword";
import { showErrorToast, showSuccessToast } from "./utils/toast-helper";

export default function App() {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenParams = queryParams.get("token");
    if (!tokenParams) return;
    setToken(tokenParams);
  }, [location]);

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      showErrorToast();
      return;
    }

    const changePassword: ChangePassword = {
      token,
      newPassword,
      confirmNewPassword,
    };

    try {
      await UpdatePassword(changePassword);
      showSuccessToast();
      setNewPassword("");
      setConfirmNewPassword("");
    } catch {
      showErrorToast();
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex items-center justify-center min-h-screen">
        <div className="justify-center w-full max-w-md mx-auto">
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-center text-title-sm sm:text-title-md">
              Change Password
            </h1>
          </div>
          <div>
            <form onSubmit={handlePasswordChange}>
              <div className="space-y-6">
                <div>
                  <Label>
                    New Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <span
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showNewPassword ? (
                        <EyeIcon className="fill-gray-500 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div>
                  <Label>
                    Confirm New Password{" "}
                    <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showConfirmNewPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                    <span
                      onClick={() =>
                        setShowConfirmNewPassword(!showConfirmNewPassword)
                      }
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showConfirmNewPassword ? (
                        <EyeIcon className="fill-gray-500 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div>
                  <Button className="w-full" size="sm">
                    Change Password
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
