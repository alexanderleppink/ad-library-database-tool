import React from 'react';
import { Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle } from 'flowbite-react';

interface NavigationProps {}

function Navigation({}: NavigationProps) {
  return (
    <Navbar className="flex justify-between p-4">
      <NavbarBrand>
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Ad Library Database Tool
        </span>
      </NavbarBrand>
      <div className="flex md:hidden">
        <NavbarToggle />
      </div>
      <NavbarCollapse>
        <NavbarLink href="/app/dashboard">Dashboard</NavbarLink>
        <NavbarLink href="/app/search">Search</NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}

export default Navigation;
