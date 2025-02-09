import React, { useEffect, useState } from "react";
import baseUrl from "../../../api/baseUrl";

const GitLensessBrand = () => {
  const token = localStorage.getItem("token");
  const [Lensesbrands, setbrands] = useState("");
  const [loadingLensesbrands, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await baseUrl.get(`api/lenses/brands`, {
          headers: { token: token },
        });
        setbrands(response.data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return [loadingLensesbrands, Lensesbrands];
};

export default GitLensessBrand;
