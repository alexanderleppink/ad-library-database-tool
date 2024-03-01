import React from 'react';
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle
} from 'flowbite-react';
import { createClient } from '@/utils/supabase/server';
import { logout } from '@/app/auth/actions';

interface NavigationProps {}

export default Navigation;

async function Navigation({}: NavigationProps) {
  const supabase = createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <Navbar className="flex justify-between p-4 items-center">
      <NavbarBrand>
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Ad Library Database Tool
        </span>
      </NavbarBrand>
      <div className="flex md:hidden">
        <NavbarToggle />
      </div>
      <NavbarCollapse>
        <NavbarLink className="flex items-center" href="/app/dashboard">
          Dashboard
        </NavbarLink>
        <NavbarLink className="flex items-center" href="/app/search">
          Search
        </NavbarLink>
        {user ? (
          <form action={logout}>
            <Button size="xs" type="submit">
              Logout
            </Button>
          </form>
        ) : (
          <Button size="sm" href="/login">
            Login
          </Button>
        )}
      </NavbarCollapse>
    </Navbar>
  );
}
