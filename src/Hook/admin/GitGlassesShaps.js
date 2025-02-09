import React, { useEffect, useState } from 'react';
import baseUrl from '../../api/baseUrl';

const GitGlassesShaps = () => {
  const token = localStorage.getItem('token');
  const [shaps, setshaps] = useState('');
  const [loadingshaps, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await baseUrl.get(`api/glasses/shaps`, {
          headers: { token: token },
        });
        setshaps(response.data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return [loadingshaps, shaps];
};

export default GitGlassesShaps;
