import {
    Header as MantineHeader,
    Group,
    Button,
    Box,
} from '@mantine/core';
import LogoPNG from './logo.png';
import { Link } from 'react-router-dom';

export function Header() {
    return (
        <Box pb={120}>
            <MantineHeader height={60} px="md">
                <Group position="apart" sx={{ height: '100%' }}>
                    <img 
                        src={LogoPNG}
                        alt="Logo"
                        className="object-contain h-10"
                    />

                    <Group>
                        <Link to="/login">
                            <Button variant="default">
                                Log in
                            </Button>
                        </Link>
                        <Link to="/signup">
                            <Button>Sign up</Button>
                        </Link>
                    </Group>
                </Group>
            </MantineHeader>
        </Box>
    );
}
