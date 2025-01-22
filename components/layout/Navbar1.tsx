"use client";
import { useSession, signOut, signIn } from "next-auth/react";
import { ChevronsDown, Github, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Separator } from "../ui/separator";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import { ToggleTheme } from "./toogle-theme";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "../ui/dropdown-menu";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RouteProps {
  href: string;
  label: string;
  route: string;
}


interface FeatureProps {
  title: string;
  description: string;
}

interface NavBarProps {
  homepage: boolean;
}

const routeList: RouteProps[] = [
  // {
  //   href: "#ownapi",
  //   label: "Set APIs",
  //   route: "/ownapi",
  // },
  {
    href: "#team",
    label: "Team",
    route: "/teams",
  },
  {
    href: "#contact",
    label: "Contact",
    route: "/contact",
  },
  {
    href: "#faq",
    label: "FAQ",
    route: "/faq",
  },
];

const featureList: FeatureProps[] = [
  {
    title: "Showcase Your Value ",
    description: "Highlight how your product solves user problems.",
  },
  {
    title: "Build Trust",
    description:
      "Leverages social proof elements to establish trust and credibility.",
  },
  {
    title: "Capture Leads",
    description:
      "Make your lead capture form visually appealing and strategically.",
  },
];

const languages = [
  { name: "Java", logo: "/svg/java.svg", route: "/compiler/java" },
  { name: "Python", logo: "/svg/python.svg", route: "/compiler/python" },
  { name: "Cpp", logo: "/svg/c++.svg", route: "/compiler/cpp" },
  { name: "C", logo: "/svg/c.svg", route: "/compiler/c" },
  {
    name: "JavaScript",
    logo: "/svg/javascript.svg",
    route: "/compiler/javascript",
  },
  { name: "R", logo: "/svg/r.svg", route: "/compiler/r" },
  { name: "Rust", logo: "/svg/rust.svg", route: "/compiler/rust" },
  { name: "Go", logo: "/svg/go.svg", route: "/compiler/go" },
  { name: "PHP", logo: "/svg/php.svg", route: "/compiler/php" },
  { name: "Swift", logo: "/svg/swift.svg", route: "/compiler/swift" },
];

export const Navbar = ({ homepage }: NavBarProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const handleGoogleSignIn = async () => {
    console.log("first");
    const result = await signIn("google", {
      callbackUrl: "/compiler/javascript",
    });
  };

  return (
    <header
      className={cn(
        !homepage && "m-[18px]",
        "shadow-inner bg-opacity-15 w-[90%] md:w-[70%] lg:w-[75%] lg:max-w-screen-xl top-5 mx-auto sticky border border-secondary z-40 rounded-2xl flex justify-between items-center p-2 bg-card"
      )}
    >
      <Link href="/" className="font-bold text-lg lg:flex items-center hidden">
        <ChevronsDown className="bg-gradient-to-tr border-secondary from-primary via-primary/70 to-primary rounded-lg w-9 h-9 mr-2 border text-white" />
        Code Compiler
      </Link>

      {/* Mobile Menu */}
      <div className="flex items-center lg:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Menu
              onClick={() => setIsOpen(!isOpen)}
              className="cursor-pointer lg:hidden"
            />
          </SheetTrigger>

          <SheetContent
            side="left"
            className="flex flex-col justify-between rounded-tr-2xl rounded-br-2xl bg-card border-secondary"
          >
            <div>
              <SheetHeader className="mb-2 ml-2">
                <SheetTitle className="flex items-center">
                  <Link href="/" className="flex items-center gap-3">
                    <Image
                      src="/logo.png"
                      width={1000}
                      height={1000}
                      alt="logo"
                      className="w-10 h-10"
                    />
                    {/* <ChevronsDown className="bg-gradient-to-tr border-secondary from-primary via-primary/70 to-primary rounded-lg w-9 h-9 mr-2 border text-white" /> */}
                    Code Compiler
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <Separator className="mb-1" />

              <div className="flex flex-col gap-1">
                {routeList.map(({ href, label, route }) => (
                  <Button
                    key={href}
                    onClick={() => setIsOpen(false)}
                    asChild
                    variant="ghost"
                    className="justify-start text-base"
                  >
                    <Link href={label == "FAQ" && homepage ? href : route}>
                      {label}
                    </Link>
                  </Button>
                ))}
              </div>

              <div className="">
                {languages.map((language, index) => (
                  <Link href={language.route} key={index}>
                    <Button
                      variant="ghost"
                      className="justify-start cursor-pointer py-1 h-12 w-40 gap-4"
                    >
                      <Image
                        width={1000}
                        height={1000}
                        src={language.logo}
                        alt={language.name}
                        className="h-8 w-8"
                      />

                      <span className="text-base">{language.name}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </div>

            <SheetFooter className="flex-col sm:flex-col justify-start items-start">
              <Separator className="mb-2" />
              <ToggleTheme />
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Menu */}
      <NavigationMenu className="hidden lg:block mx-auto">
        <NavigationMenuList>
          {homepage && (
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-card text-base">
                Features
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[600px] grid-cols-2 gap-5 p-4">
                  <Image
                    src="https://avatars.githubusercontent.com/u/75042455?v=4"
                    alt="RadixLogo"
                    className="h-full w-full rounded-md object-cover"
                    width={600}
                    height={600}
                  />
                  <ul className="flex flex-col gap-2">
                    {featureList.map(({ title, description }) => (
                      <li
                        key={title}
                        className="rounded-md p-3 text-sm hover:bg-muted"
                      >
                        <p className="mb-1 font-semibold leading-none text-foreground">
                          {title}
                        </p>
                        <p className="line-clamp-2 text-muted-foreground">
                          {description}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          )}

          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link href="/compiler/javascript" className="text-base px-2">
                Compiler
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            {routeList.map(({ href, label, route }) => (
              <NavigationMenuLink key={href} asChild>
                <Link
                  href={label == "FAQ" && homepage ? href : route}
                  className="text-base px-2"
                >
                  {label}
                </Link>
              </NavigationMenuLink>
            ))}
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className="hidden lg:block">
        <ToggleTheme />
      </div>

      <div className="flex items-center gap-2">
        {session && (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 cursor-pointer">
              <div className="h-9 w-9 rounded-full overflow-hidden">
                <Image
                  src={session.user?.profielURL || "/boyavatar.jpg"}
                  alt={session.user?.name || "User"}
                  className="object-cover"
                  width={1000}
                  height={1000}
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <div className="p-2">
                <p className="font-bold">{session.user?.name}</p>
                <p className="text-sm">{session.user?.email}</p>
              </div>
              <DropdownMenuItem>
                <p onClick={() => router.push(`/dashboard`)}>Dashboard</p>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/sign-in" })}
              >
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      {!session && (
        <motion.button
          onClick={handleGoogleSignIn}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex text-sm justify-center items-center py-2 px-3 rounded-md shadow-sm bg-inherit font-medium text-muted-foreground hover:bg-muted/50 gap-2"
        >
          Sign in
          <svg
            className="w-5 h-5 mr-2"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
          </svg>
        </motion.button>
      )}
    </header>
  );
};
