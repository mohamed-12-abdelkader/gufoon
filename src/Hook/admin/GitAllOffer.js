import React, { useEffect, useState } from 'react';
import baseUrl from '../../api/baseUrl';

const GitAllOffer = ({ id }) => {
  const token = localStorage.getItem('token');
  const [offers, setoffers] = useState('');
  const [loadingOffers, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await baseUrl.get(`api/offer/${id}`, {
          headers: { token: token },
        });
        setoffers(response.data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);
  return [loadingOffers, offers];
};

export default GitAllOffer;
