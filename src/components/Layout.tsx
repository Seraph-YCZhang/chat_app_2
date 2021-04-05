import { Box } from '@chakra-ui/layout';
import React, { FC, PropsWithChildren } from 'react';

interface Props {}

const Layout: FC<PropsWithChildren<Props>> = ({ children }) => {
    return (
        <Box minH='100vh' maxW='800px' margin='auto' marginTop='10rem'>
            {children}
        </Box>
    );
};
export default Layout;
