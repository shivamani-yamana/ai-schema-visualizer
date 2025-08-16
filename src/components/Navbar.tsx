import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import GitHubButton from "react-github-btn";

export default function App() {
  return (
    <Navbar className="bg-blue-900 bg-clip-padding bg-opacity-0 backdrop-filter backdrop-blur-md rounded-md">
      <NavbarBrand>
        <p className="font-bold text-2xl">SchemaIQ</p>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          <GitHubButton
            href="https://github.com/shivamani-yamana/ai-schema-visualizer"
            data-color-scheme="no-preference: dark; light: light; dark: dark;"
            data-icon="octicon-star"
            data-size="large"
            data-show-count="true"
            aria-label="Star shivamani-yamana/ai-schema-visualizer on GitHub"
          >
            Star
          </GitHubButton>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
