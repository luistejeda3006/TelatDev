import React, {useState, useEffect} from "react";

const useFetch = (url, ...rest) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const fetchData = async () => {
    const response = await fetch(url, ...rest);
    const data = await response.json();
    setData(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { loading, data };
};

export default useFetch;