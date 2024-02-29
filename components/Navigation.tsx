import React from 'react';
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle
} from 'flowbite-react';
import Link from 'next/link';

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
        <Link href="/app/dashboard">
          <NavbarLink>Dashboard</NavbarLink>
        </Link>
        <Link href="/app/search">
          <NavbarLink>Search</NavbarLink>
        </Link>
      </NavbarCollapse>
    </Navbar>
  );
}

export default Navigation;
