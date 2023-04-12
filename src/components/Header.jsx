import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  HStack,
  IconButton,
  List,
  ListIcon,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import {
  MdDarkMode,
  MdExpandLess,
  MdExpandMore,
  MdHome,
  MdLightMode,
  MdMenu,
  MdScoreboard,
} from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@chakra-ui/icon";

function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();

  const navigateToDiscover = (type, state) => {
    navigate(`/discover/${type}`, { state });
    if (isOpen) onClose();
  };

  return (
    <Box bg="gray.800" color="white" w="100%">
      <Flex
        justify="space-between"
        align="center"
        maxW="1200px"
        mx="auto"
        px={4}
        py={4}
      >
        <HStack align="center">
          <Icon as={MdHome} />
          <Link href="/" fontSize="lg">
            Home
          </Link>
        </HStack>
        <HStack align="center">
          <Icon as={MdScoreboard} />
          <Link href="/scoreboard" fontSize="lg">
            Scoreboard
          </Link>
        </HStack>
      </Flex>
    </Box>
  );
}

export default Header;
