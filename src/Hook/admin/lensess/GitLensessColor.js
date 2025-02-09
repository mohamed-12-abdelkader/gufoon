import React, { useEffect, useState } from "react";
import baseUrl from "../../../api/baseUrl";

const GitLensessColor = () => {
  const token = localStorage.getItem("token");
  const [colors, setcolors] = useState("");
  const [loadingcolors, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await baseUrl.get(`api/lenses/lensesColor`, {
          headers: { token: token },
        });
        setcolors(response.data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return [loadingcolors, colors];
};

export default GitLensessColor;
