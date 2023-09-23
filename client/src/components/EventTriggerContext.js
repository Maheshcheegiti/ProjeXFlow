import { createContext, useContext, useState } from "react";

// Create a context
const EventTriggerContext = createContext();

// Create a provider component
export const EventTriggerProvider = ({ children }) => {
  const [wsTrigger, setWSTrigger] = useState(false);
  const [teamTrigger, setTeamTrigger] = useState(false);
  const [taskTrigger, setTaskTrigger] = useState(false);

  return (
    <EventTriggerContext.Provider
      value={{
        wsTrigger,
        setWSTrigger,
        teamTrigger,
        setTeamTrigger,
        taskTrigger,
        setTaskTrigger,
      }}
    >
      {children}
    </EventTriggerContext.Provider>
  );
};

// Create a custom hook to access the event trigger state and function
export const useEventTrigger = () => useContext(EventTriggerContext);
