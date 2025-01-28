import React, { useEffect, useState } from "react";
import baseUrl from "../../api/baseUrl";

const GitGlassesMatrial = () => {
  const token = localStorage.getItem("token");
  const [matrials, setmatrials] = useState("");
  const [loadingmatrials, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await baseUrl.get(`api/glasses/matrials`, {
          headers: { token: token },
        });
        setmatrials(response.data);
      } catch (error) {
        console.log("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return [loadingmatrials, matrials];
};

export default GitGlassesMatrial;
