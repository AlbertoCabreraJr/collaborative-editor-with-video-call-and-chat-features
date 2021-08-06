import { BrowserRouter, Route, Switch } from "react-router-dom";

import NotFound from "./components/NotFound/NotFound";
import Room from "./components/Room/Room";
import SignIn from "./components/SignIn/SignIn";
import Home from "./components/Home/Home";

import { useContext } from "react";
import { Context } from "./context/Context";

import { useEffect } from "react";

const App = () => {
  const { user, setUser } = useContext(Context);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("profile")));
  }, []);

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          {user ? <Home /> : <SignIn />}
        </Route>
        <Route path="/room/:roomID">
          <Room />
        </Route>
        <Route exact path="/room" component={NotFound}></Route>
      </Switch>
    </BrowserRouter>
  );
};

export default App;
