import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./IdLogin/AuthContext";
import { useLanguage } from "../../LanguageContext";
import { useHighContrast } from "../Accessibility/HighContrastMode";
import { useKakaoAuth } from "./KakaoLogin/KAuthContext";
import { useCookies } from "react-cookie";

const AuthButtons: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const textClassName = language === "ko" ? "font-kor" : "font-eng";
  const { isHighContrast } = useHighContrast();
  const { isLoggedIn, logout } = useAuth();
  const [isKakaoLoggedIn, setIsKakaoLoggedIn] = useState(false);
  const [, , removeCookie] = useCookies();
  const { getKakaoLoginStatus, resetKakaoLoginStatus } = useKakaoAuth();

  useEffect(() => {
    setIsKakaoLoggedIn(getKakaoLoginStatus());
  }, []);

  const handleLogout = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      await axios.post(`${apiUrl}/logout`, {}, { withCredentials: true });

      if (getKakaoLoginStatus()) {
        resetKakaoLoginStatus();
        removeCookie("sessionId", { path: "/" });
      } else {
        logout();
      }

      console.log("Logout success");
      alert("Logout success");
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed");
    }
  };

  return (
    <div className="flex justify-center space-x-4">
      {isLoggedIn || isKakaoLoggedIn ? (
        <>
          <span
            className={`${textClassName} ${
              isHighContrast ? "text-yellow-300" : "text-neutral-800"
            }`}
          >
            {isKakaoLoggedIn ? "카카오 로그인 성공" : "일반 로그인 성공"}
          </span>
          <button onClick={handleLogout} className="...">
            {language === "ko" ? "로그아웃하기" : "Logout"}
          </button>
        </>
      ) : (
        <div>
          <Link to="/login">
            <button className="...">
              {language === "ko" ? "로그인하기" : "Login"}
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default AuthButtons;
