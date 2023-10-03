import React, { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./screens/Login";
import Workspace from "./screens/Workspace";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import SignUpNext from "./components/SignUpNext";
import ForgotPassword from "./components/ForgotPassword";
import WorkspaceEmpty from "./components/WorkspaceEmpty";
import WorkSpaceFull from "./components/WorkSpaceFull";
import AboutUs from "./components/AboutUs";
import Contact from "./components/Contact";
import TermsandConditions from "./components/TermsandConditions";
import { ToastContainer } from "react-toastify";
import { UserProvider } from "./components/UserContext";
import { WsnameProvider } from "./components/WsnameContext";
import { EventTriggerProvider } from "./components/EventTriggerContext";
import "./App.css";

const App = () => {
  return (
    <UserProvider>
      <Fragment>
        <Router>
          <WsnameProvider>
            <EventTriggerProvider>
              <Nav></Nav>
              <Routes>
                <Route exact path="/" element={<Login />}>
                  <Route exact path="/" element={<LoginForm />}></Route>
                  <Route
                    exact
                    path="/signupnext"
                    element={<SignUpNext />}
                  ></Route>
                  <Route exact path="/signup" element={<SignupForm />}></Route>
                  <Route
                    exact
                    path="/forgot_password"
                    element={<ForgotPassword />}
                  ></Route>
                </Route>
                <Route exact path="/workspace" element={<Workspace />}>
                  <Route
                    exact
                    path="/workspace"
                    element={<WorkspaceEmpty />}
                  ></Route>
                  <Route
                    exact
                    path="/workspace/chat"
                    element={<WorkSpaceFull />}
                  ></Route>
                </Route>
                <Route exact path="/aboutus" element={<AboutUs />} />
                <Route exact path="/contact" element={<Contact />} />
                <Route
                  exact
                  path="/termsandconditions"
                  element={<TermsandConditions />}
                />
              </Routes>
              <Footer></Footer>
              <ToastContainer />
            </EventTriggerProvider>
          </WsnameProvider>
        </Router>
      </Fragment>
    </UserProvider>
  );
};

export default App;
