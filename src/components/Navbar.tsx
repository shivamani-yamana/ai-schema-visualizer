import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@heroui/react";
import { FaGithub } from "react-icons/fa6";

export default function App() {
  return (
    <Navbar className="bg-blue-900 bg-clip-padding bg-opacity-0 backdrop-filter backdrop-blur-md rounded-md">
      <NavbarBrand>
        <p className="font-bold text-2xl">SchemaIQ</p>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button as={Link} href="#" variant="flat">
            <FaGithub />
            Github
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
