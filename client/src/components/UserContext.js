import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  // Initialize user data from localStorage or empty strings
  const [userEmail, setUserEmail] = useState(
    localStorage.getItem("userEmail") || ""
  );
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || ""
  );
  const [linkedin, setLinkedin] = useState(
    localStorage.getItem("linkedin") || ""
  );
  const [github, setGithub] = useState(localStorage.getItem("github") || "");

  // Save user data to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("userEmail", userEmail);
      localStorage.setItem("userName", userName);
      localStorage.setItem("linkedin", linkedin);
      localStorage.setItem("github", github);
    } catch (error) {
      console.error("Error saving user data to localStorage:", error);
    }
  }, [userEmail, userName, linkedin, github]);

  return (
    <UserContext.Provider
      value={{
        userEmail,
        setUserEmail,
        userName,
        setUserName,
        linkedin,
        setLinkedin,
        github,
        setGithub,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
