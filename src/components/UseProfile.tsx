import axios from "axios";
import { useEffect, useState } from "react";

export const useProfile = () => {
  const [data, setData] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    axios.get("/api/profile").then((res) => {
      setData(res.data);
      setLoading(false);
    });
  }, []);

  return { data, loading };
};
