import { Input, Button } from "@chakra-ui/react";
import LoginAdmin from "../../Hook/admin/useLogin";
import Spinner from "react-bootstrap/Spinner";

const Login = () => {
  const [
    handleLogin,
    passChange,
    mailChange,
    user_name,
    pass,
    loading,
  ] = LoginAdmin();

  return (
    <div className="login">
      <div className="login_form   w-[90%]  border shadow-md md:w-[60%]">
        <div className=" text-center mt-5">
          <h1 className="font-bold text-xl">تسجيل الدخول </h1>
        </div>
        <div className=" p-2 form md:p-5">
          <Input
            value={user_name}
            onChange={mailChange}
            dir="rtl"
            placeholder="اسم المستخدم "
            size="lg"
            className="my-3 bg-white h-5 "
          />
          <Input
            value={pass}
            onChange={passChange}
            dir="rtl"
            placeholder="كلمة السر"
            size="lg"
            className="my-3 bg-white "
          />
        </div>
        <div className="text-center mb-5">
          <Button colorScheme="blue" onClick={handleLogin}>
            {loading ? <Spinner /> : "  تسجيل الدخول"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
