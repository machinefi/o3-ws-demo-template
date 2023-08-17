"use client";

import jwt_decode from "jwt-decode";

import useStore from "../../store";

export const TokenInput = () => {
  const {
    token,
    setToken,
    setErrorMsg,
  } = useStore((state) => state);

  const handleInputChange = (e: any) => {
    const { value } = e.target;
    const trimmedValue = value.trim();
    setToken(trimmedValue);
    try {
      if (!trimmedValue) {
        setErrorMsg("");
        return;
      }

      const decoded = jwt_decode(trimmedValue) as any;

      if (!decoded.sub) {
        setErrorMsg("Invalid token");
      }

      if (!decoded.exp || decoded.exp < Date.now() / 1000) {
        setErrorMsg("Token has expired");
      }
    } catch (e) {
      setErrorMsg("Invalid token");
    }
  };

  return (
    <input
      id="token"
      type="password"
      placeholder="Enter your access token"
      value={token}
      onChange={handleInputChange}
    />
  );
};
