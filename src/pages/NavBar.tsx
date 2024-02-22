import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User,
} from "firebase/auth";
import app from "../firebase";
import storage from "../utils/storage";

const NavWrapper = styled.nav<{ $show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 36px;
  letter-spacing: 16px;
  z-index: 100;
  cursor: pointer;
  background-color: ${(props) => (props.$show ? "#424242" : "white")};
`;

const Image = styled.img`
  cursor: pointer;
  width: 100%;
`;

const Logo = styled.div`
  padding: 0;
  width: 100px;
  margin-top: 4px;
`;

const Login = styled.a`
  background-color: rgba(0, 0, 0, 0.6);
  padding: 8px 16px;
  text-transform: uppercase;
  letter-spacing: 1.55px;
  border: 1px solid #f9f9f9;
  border-radius: 4px;
  transition: all 0.2s ease 0s;
  color: white;

  &:hover {
    background-color: #f9f9f9;
    color: #000;
    border-color: #f9f9f9;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 48px;
  right: 0px;
  background: rgb(19, 19, 19);
  border: 1px solid rgba(151, 151, 151, 0.34);
  border-radius: 4px;
  box-shadow: rgb(0 0 0 / 50%) 0px 0px 18px 0px;
  padding: 10px;
  font-size: 12px;
  letter-spacing: 3px;
  width: 100px;
  opacity: 0;
  color: white;
`;

const SignOut = styled.div`
  position: relative;
  height: 48px;
  width: 48px;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;

  &:hover {
    ${Dropdown} {
      opacity: 1;
      transition-duration: 1s;
    }
  }
`;

const UserImg = styled.img`
  border-radius: 50%;
  width: 100%;
  height: 100%;
`;

const NavBar = () => {
  const [show, setShow] = useState(false);
  const { pathname } = useLocation();

  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/login");
      } else if (user && pathname === "/login") {
        navigate("/");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [pathname]);

  const UserDataFromStorage = localStorage.getItem("userData");
  //  const initialUserData =  UserDataFromStorage ? JSON.parse(UserDataFromStorage) : null;
  const initialUserData = storage.get<User>("userData");
  // JSON.parse는 string만 할수 있다. but localStorage.getItem은 null이 될 수도 있어서 에러.

  const [userData, setUserData] = useState<User | null>(initialUserData);
  const listener = () => {
    if (window.scrollY > 50) {
      setShow(true);
    } else {
      setShow(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", listener);

    return () => {
      window.removeEventListener("scroll", listener);
    };
  }, []);

  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  const handleAuth = () => {
    console.log("handleAuth");
    const userInfo = signInWithPopup(auth, provider)
      .then((result) => {
        setUserData(result.user);
        storage.set("userData", result.user);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  };

  const handleLogOut = () => {
    signOut(auth)
      .then(() => {
        storage.remove("userData");
        setUserData(null);
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <>
      <NavWrapper $show={show}>
        <Logo>
          <Image
            src='../src/assets/img/pokelogo.png'
            alt=''
            className='src'
            onClick={() => (window.location.href = "/")}
          />
        </Logo>
        {pathname === `/login` ? (
          <Login onClick={handleAuth}>login</Login>
        ) : (
          <SignOut>
            {userData?.photoURL && <UserImg src={userData.photoURL} />}
            <Dropdown>
              <span onClick={handleLogOut}>Sign Out</span>
            </Dropdown>
          </SignOut>
          // ""
        )}
      </NavWrapper>
    </>
  );
};

export default NavBar;
