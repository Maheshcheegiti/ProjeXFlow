import { createContext, useContext, useState } from "react";

// Create a context
const EventTriggerContext = createContext();

// Create a provider component
export const EventTriggerProvider = ({ children }) => {
  const [wsTrigger, setWSTrigger] = useState(false);
  const [teamTrigger, setTeamTrigger] = useState(false);
  const [taskTrigger, setTaskTrigger] = useState(false);
  const [signInTrigger, setSignInTrigger] = useState(false);
  const [profileTrigger, setProfileTrigger] = useState(false);

  return (
    <EventTriggerContext.Provider
      value={{
        wsTrigger,
        setWSTrigger,
        teamTrigger,
        setTeamTrigger,
        taskTrigger,
        setTaskTrigger,
        signInTrigger,
        setSignInTrigger,
        profileTrigger,
        setProfileTrigger,
      }}
    >
      {children}
    </EventTriggerContext.Provider>
  );
};

// Create a custom hook to access the event trigger state and function
export const useEventTrigger = () => useContext(EventTriggerContext);
