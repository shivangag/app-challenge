import { Box } from "@mui/system";
import { NextPage } from "next"
import Head from 'next/head'
import Header from "./common/header"

const Layout: NextPage = (props: any) => {
    const { children } = props
    return (
        <div className='layout'>
            <Head>
                <title>App Challenge</title>
                <meta name="description" content="App Challenge - Next App" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
            </Head>
            <Header></Header>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100%)` } }}
            >
                {children}
            </Box>
        </div>
    )
}

export default Layout