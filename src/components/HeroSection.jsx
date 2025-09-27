import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/auth");
  }, []);

  return <div>HeroSection</div>;
};

export default HeroSection;
