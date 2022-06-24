import { useState, useEffect } from "react";

type Coord = {
  lat: number | string;
  long: string | number;
};

const useLocation = () => {
  const [coord, setCoord] = useState<Coord>({ lat: "", long: "" });
  const [rute, setRute] = useState<string | null>(null);

  useEffect(() => {
    const getPost = async () => {
      const successCallback: PositionCallback = async (pos) => {
        const lat = pos.coords.latitude;
        const long = pos.coords.longitude;
        setRute(
          `https://www.google.com/maps/dir/-7.540563,109.287605/plaza+bni/@-6.8906523,106.8947052,8z/`
        );
        setCoord({ lat, long });
      };
      const errorCallback: PositionErrorCallback = async (error) => {
        console.error(error);
      };
      navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    };
    if (navigator.geolocation) {
      getPost();
    }
  }, []);

  return coord;
};

export default useLocation;
