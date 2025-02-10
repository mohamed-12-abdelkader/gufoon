import React, { useEffect, useState } from "react";
import baseUrl from "../../../api/baseUrl";

const GitLensesReplacement = () => {
  const token = localStorage.getItem("token");
  const [replacements, setreplacements] = useState("");
  const [loadingreplacements, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await baseUrl.get(`api/lenses/lensesReplacement`, {
          headers: { token: token },
        });
        setreplacements(response.data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return [loadingreplacements, replacements];
};

export default GitLensesReplacement;
