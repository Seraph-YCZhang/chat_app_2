import { Link } from '@chakra-ui/layout';
import React, { FC } from 'react';
import Layout from '../components/Layout';
import NextLink from 'next/link';
interface Props {}

const Index: FC<Props> = ({}) => {
    return (
        <Layout>
            <Link as={NextLink} href='/chat'>
                Go Study
            </Link>
        </Layout>
    );
};

export default Index;
