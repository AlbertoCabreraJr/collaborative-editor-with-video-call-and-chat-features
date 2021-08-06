import "./signin.scss";
import logo from "../../static/logo.png";
import vid1 from "../../static/vid1.mp4";
import vid2 from "../../static/vid2.mp4";
import signinImage from "../../static/signinImage.png";
import googleLogo from "../../static/google.svg";
import fbLogo from "../../static/fb.png";

import GoogleLogin from "react-google-login";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

import { useContext } from "react";
import { Context } from "../../context/Context";

const SignIn = () => {
  const { login } = useContext(Context);

  const responseGoogle = (response) => {
    login(response, "google");
  };

  const responseFacebook = (response) => {
    login(response, "facebook");
  };

  return (
    <div className="signin-container">
      <div className="signin-showcase">
        <div className="showcase-logo-container">
          <img src={logo} alt="CodeCollab Logo" />
        </div>
        <div className="showcase-heading">Share code in real-time</div>
        <div className="showcase-sub-heading">
          A real-time collaborative editor with built-in chat and videocall
        </div>
        <div className="showcase-video-container">
          <video src={vid1} autoPlay muted loop playsInline />
          <video src={vid2} autoPlay muted loop playsInline />
        </div>
        <div className="showcase-p">
          Best for coding interviews, teaching, demos, and more
        </div>
      </div>
      <div className="signin-contents">
        <div className="signin-wrapper">
          <img src={signinImage} />
          <div className="signin-buttons-wrapper">
            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_ID}
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy={"single_host_origin"}
              render={(renderProps) => (
                <button
                  className="btn-signin btn-signin-google"
                  onClick={renderProps.onClick}
                >
                  <img src={googleLogo} />
                  Google
                </button>
              )}
            />

            <FacebookLogin
              appId={process.env.REACT_APP_FACEBOOK_ID}
              fields="name,email,picture"
              autoLoad={false}
              callback={responseFacebook}
              render={(renderProps) => (
                <button
                  className="btn-signin btn-signin-facebook"
                  onClick={renderProps.onClick}
                >
                  <img src={fbLogo} />
                  Facebook
                </button>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
