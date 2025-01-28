import React, { useEffect, useState } from "react";
import baseUrl from "../../api/baseUrl";

const GitGlassLensesColor = () => {
  const token = localStorage.getItem("token");
  const [glassLensesColor, setglassLensesColor] = useState("");
  const [loadingLensesColor, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await baseUrl.get(`api/glasses/glassLensesColor`, {
          headers: { token: token },
        });
        setglassLensesColor(response.data);
      } catch (error) {
        console.log("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return [loadingLensesColor, glassLensesColor];
};

export default GitGlassLensesColor;
