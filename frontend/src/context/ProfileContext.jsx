import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";

const ProfileContext = createContext(null);
const USER_KEY = "stockflow-user";
const apiBase = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const uploadBase = apiBase.replace(/\/api\/?$/, "");

const absoluteImage = (value) => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value) || value.startsWith("data:")) return value;
  return `${uploadBase}${value.startsWith("/") ? value : `/${value}`}`;
};

export const ProfileProvider = ({ children }) => {
  const { user: authUser } = useAuth();
  const [profileImage, setProfileImage] = useState(
    absoluteImage(authUser?.profileImage),
  );
  const [user, setUser] = useState(authUser || null);

  useEffect(() => {
    setUser(authUser || null);
    setProfileImage(absoluteImage(authUser?.profileImage));
    if (authUser) localStorage.setItem(USER_KEY, JSON.stringify(authUser));
    else localStorage.removeItem(USER_KEY);
  }, [authUser]);

  useEffect(() => {
    const sync = () => {
      try {
        setUser(JSON.parse(localStorage.getItem(USER_KEY) || "null"));
      } catch {
        setUser(null);
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const updateProfileImage = (image) => setProfileImage(absoluteImage(image));
  const removeProfileImage = () => setProfileImage("");
  const updateUser = (updatedUser) => {
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const value = useMemo(
    () => ({
      user,
      profileImage,
      updateProfileImage,
      removeProfileImage,
      updateUser,
    }),
    [user, profileImage],
  );
  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context)
    throw new Error("useProfile must be used inside ProfileProvider");
  return context;
};
