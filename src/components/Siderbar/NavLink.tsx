import {
  Icon,
  Link as ChrakraLink,
  Text,
  LinkProps as ChckraLinkProps,
} from "@chakra-ui/react";
import { ElementType } from "react";
import Link from "next/link";

interface NavLinkProps extends ChckraLinkProps {
  icon: ElementType;
  children: string;
  href:string;
}

export function NavLink({ icon, children, href, ...rest }: NavLinkProps) {
  return (
    <Link href={href} passHref>
    <ChrakraLink display="flex" alignItems="center" {...rest}>
      <Icon as={icon} fontSize="20" />
      <Text ml="4" fontWeight="medium">
        {children}
      </Text>
    </ChrakraLink>
    </Link>
  );
}
