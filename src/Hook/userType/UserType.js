import { useEffect, useState } from "react";

const UserType = () => {
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [isAdmin, setIsAdmin] = useState();

  const [user, setuser] = useState();

  useEffect(() => {
    if (userData != null) {
      if (userData.role === "teacher") {
        setIsAdmin(false);
        setuser(false);
      } else if (userData.role === "admin") {
        setIsAdmin(true);

        setuser(false);
      } else {
        setIsAdmin(false);

        setuser(true);
      }
    }
  }, []);
  return [userData, isAdmin, user];
};

export default UserType;
