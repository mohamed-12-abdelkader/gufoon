import React, { useEffect, useState } from "react";
import baseUrl from "../../../api/baseUrl";

const GitLensesType = () => {
  const token = localStorage.getItem("token");
  const [types, settypes] = useState("");
  const [loadingtypes, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await baseUrl.get(`api/lenses/lensesType`, {
          headers: { token: token },
        });
        settypes(response.data);
      } catch (error) {
        console.log("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return [loadingtypes, types];
};

export default GitLensesType;
