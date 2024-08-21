/* eslint-disable no-unused-vars */
import React from 'react';
// import NavJp from './NavJp';
import JPMenu from './JPMenu';
import 'bootstrap/dist/css/bootstrap.min.css'
import { Center, Heading, Text, VStack } from '@chakra-ui/react';
import './App.css'
export default function Home() {
    

    return <>
        <JPMenu />
        <Center height={'640px'}>
            <VStack>
            <Heading fontSize={'50px'}>
                remonJP / レモンJP
            </Heading>
            <Text fontSize={'xl'}>
                Kanji and JMdict dictionary with applied word deconstructor and morphological analyzer
            </Text>
            </VStack>

        </Center>
    </>
}