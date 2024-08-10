/* eslint-disable no-unused-vars */
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerBody,
  useDisclosure,
  Button,
  VStack,
  Text,
  Icon,
  Box,
  Menu,
  MenuButton,
  Portal,
  MenuList,
  MenuItem,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from '@chakra-ui/react';
import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';
import { MdDashboardCustomize } from "react-icons/md";
import { HiMiniHome } from 'react-icons/hi2';
import { FaBrain } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
function JPMenu() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button colorScheme='blue' onClick={onOpen} variant='outline'  className='m-1'>
        Main menu
      </Button>
      <Drawer placement={'left'} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>Main Menu</DrawerHeader>
          <DrawerBody padding={0}>
            <VStack spacing={0} align='stretch'>
              <Box className='smb'>
                <Icon as={HiMiniHome} boxSize={7} className='icb' />
                Home
              </Box>
              <Accordion allowMultiple>
                <AccordionItem className='acoi'>
                

                  <AccordionButton className='acobo p-0'>
                    <Box className='smb'>
                      <Icon as={FaBrain} boxSize={7} className='icb' />
                      Quiz
                    </Box>
                  </AccordionButton>
                  {[5,4,3,2,1].map((x, i) => {
                    const data  = `n${x}`
                    return (
                      <NavLink to='/quiz' key={`nav-N${x}`} state={{data}}>
                        <AccordionPanel className='sma' >
                          JLPT N{x}
                        </AccordionPanel>
                      </NavLink>
                    )

                  })}
                  
                </AccordionItem>
              </Accordion>
              <NavLink to='/custom'>
                <Box className='smb'>
                  <Icon as={MdDashboardCustomize} boxSize={7} className='icb' />
                    Custom
                </Box>
              </NavLink>
              <NavLink to='/custominput'>
                <Box className='smb'>
                  <Icon as={MdDashboardCustomize} boxSize={7} className='icb' />
                    Custom Input
                </Box>
              </NavLink>
              <NavLink to='/random'>
                <Box className='smb'>
                  <Icon as={GiPerspectiveDiceSixFacesRandom} boxSize={7} className='icb' />
                  Random
                </Box>
              </NavLink>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

    </>
  );
}

export default JPMenu;
