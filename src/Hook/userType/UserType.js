import { useEffect, useState } from "react";

const UserType = () => {
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [isAdmin, setIsAdmin] = useState();

  const [user, setuser] = useState();

  useEffect(() => {
    if (userData != null) {
      if (userData.isSuperuser === true) {
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
