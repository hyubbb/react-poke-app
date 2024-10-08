import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import fav from "../assets/img/fav.png";
import loginIcon from "../assets/img/login.png";
import logo from "../assets/img/pokelogo.png";
import Autocomplete from "../components/Autocomplete";
import { useAppSelector } from "../hooks/redux";
import { FormattedPokemonData } from "../types/FormattedPokemonData";

const NavWrapper = styled.nav<{ $show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  display: flex;
  backdrop-filter: blur(2px);
  justify-content: space-between;
  align-items: center;
  padding: 0 36px;
  letter-spacing: 16px;
  z-index: 100;
  cursor: pointer;
  background-color: ${(props) => (props.$show ? "#42424230" : "#fff")};
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
  width: 100px;
  top: 48px;
  padding: 10px;
  background: rgb(19, 19, 19);
  border: 1px solid rgba(151, 151, 151, 0.34);
  border-radius: 4px;
  box-shadow: rgb(0 0 0 / 50%) 0px 0px 18px 0px;
  font-size: 12px;
  text-align: center;
  letter-spacing: 3px;
  opacity: 0;
  color: white;
`;

const SignOut = styled.div`
  position: relative;
  height: 45px;
  width: 45px;
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

    if (!userData) {
      navigate("/login");
    }

    return () => {
      unsubscribe();
    };
  }, [pathname]);

  const initialUserData = storage.get<User>("userData");

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
  const { allPokemon } = useAppSelector((state) => state.pokemon);
  const [displayPokemons, setDisplayPokemons] = useState<
    FormattedPokemonData[]
  >([]);
  return (
    <>
      <NavWrapper $show={show}>
        <Logo>
          <Image
            src={logo}
            alt='logo'
            className='src'
            onClick={() => (window.location.href = "/")}
          />
        </Logo>
        <Autocomplete
          allPokemons={allPokemon}
          // setDisplayPokemons={setDisplayPokemons}
        />
        <div className='flex gap-[30px] justify-center items-center'>
          {/* {userData && ( */}

          {/* )} */}
          {pathname === `/login` ? (
            <Login onClick={handleAuth}>login</Login>
          ) : (
            <>
              <div className='text-[40px]'>
                <Link to={"/pokedex"}>
                  <img src={fav} alt='' width={50} />
                </Link>
              </div>
              <SignOut>
                {userData?.photoURL ? (
                  <UserImg src={loginIcon} />
                ) : (
                  <div className='bg-zinc-950 w-full h-full rounded-full' />
                )}

                <Dropdown>
                  <span onClick={handleLogOut}>logout</span>
                </Dropdown>
              </SignOut>
            </>
          )}
        </div>
      </NavWrapper>
    </>
  );
};

export default NavBar;
