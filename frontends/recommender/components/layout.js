import * as React from 'react';
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../src/theme';
import TopBar from "../templates/components/TopBar";
import {Container} from "@mui/material";

export default function Layout({ children }) {
    return (
        <>
            <Head>
                <meta name="viewport" content="initial-scale=1, width=device-width" />
            </Head>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <TopBar />
                <main>
                    <Container sx={{ py: 8 }} maxWidth="md">
                        {children}
                    </Container>
                </main>
            </ThemeProvider>
        </>
    );
}

