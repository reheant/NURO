import React, { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import {AcmeLogo} from "../AcmeLogo"; 
import { IconMoon, IconSun } from "@tabler/icons-react";
import { useTheme } from "next-themes";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="w-100">
      <Navbar position="static">
          <NavbarBrand>
            <AcmeLogo />
            <h1 className="font-bold text-inherit">NURO</h1>
          </NavbarBrand>
          <NavbarContent className="sm:flex gap-4" justify="center">
            <NavbarItem isActive = {window.location.pathname === "/"}>
              <Link color={window.location.pathname === "/" ? "primary" :"foreground"} href="/" aria-current="page">
                Dashboard
              </Link>
            </NavbarItem>
            <NavbarItem isActive = {window.location.pathname === "/about"}>
              <Link color={window.location.pathname === "/about" ? "primary" :"foreground"} href="/about" >
                Live Transcript
              </Link>
            </NavbarItem>
          </NavbarContent>
          <NavbarContent justify="end">
            <NavbarItem>
              <Button isIconOnly color="primary" variant="flat" onClick={() => {if (theme === 'dark') {setTheme('light')} else {setTheme('dark')};}}>
                {theme==='light' ? <IconMoon/> : <IconSun/> }
              </Button>
            </NavbarItem>
          </NavbarContent>
        </Navbar>
    </div>
  );
}

export default Header;