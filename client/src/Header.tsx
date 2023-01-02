import {
    Header as MantineHeader,
    Group,
    Button,
    Box,
    UnstyledButton,
    Menu,
    Text,
    Badge,
    createStyles,
} from '@mantine/core';
import LogoPNG from './logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useContext, forwardRef, useState } from 'react';
import { UserContext } from './context';
import { IconChevronDown, IconLogout } from '@tabler/icons';
import { useAuth } from './auth';
import UserInfo from './UserInfo'

interface UserButtonProps extends React.ComponentPropsWithoutRef<'button'> {
    name: string;
    is_student: boolean;
    icon?: React.ReactNode;
}

const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
    ({ name, is_student, icon, ...others }: UserButtonProps, ref) => (
        <UnstyledButton
            ref={ref}
            {...others}
        >
            <Group>
                <div style={{ flex: 1 }}>
                    <UserInfo name={name} is_student={is_student} />
                </div>

                {icon || <IconChevronDown size={16} />}
            </Group>
        </UnstyledButton>
    )
);

const useStyles = createStyles((theme) => ({
    links: {
        [theme.fn.smallerThan('xs')]: {
            display: 'none',
        },
    },

    link: {
        display: 'block',
        lineHeight: 1,
        padding: '8px 12px',
        borderRadius: theme.radius.sm,
        textDecoration: 'none',
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        },
    },

    linkActive: {
        '&, &:hover': {
            backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
            color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
        },
    },
}));

export function Header() {
    const [user, _dispatchUser] = useContext(UserContext);
    const { classes, cx } = useStyles();
    const navigate = useNavigate();
    const { logout } = useAuth();


    interface Link {
        link: string;
        label: string;
    }

    const links: Link[] = [
        {
            link: "/",
            label: "Home",
        },
        {
            link: "/my",
            label: "My Projects"
        }
    ];

    const [active, setActive] = useState(links[0].link);

    const items = links.map((link) => (
        <a
            key={link.label}
            href={link.link}
            className={cx(classes.link, { [classes.linkActive]: active === link.link })}
            onClick={(event) => {
                event.preventDefault();
                setActive(link.link);
                navigate(link.link);
            }}
        >
            {link.label}
        </a>
    ));

    return (
        <Box>
            <MantineHeader height={60} px="md">
                <Group position="apart" sx={{ height: '100%' }}>
                    <img 
                        src={LogoPNG}
                        alt="Logo"
                        className="object-contain h-10 cursor-pointer"
                        onClick={() => navigate("/")}
                    />

                    {user.name.length > 0 && <Group>
                        {items}
                    </Group>}

                    {user.name.length == 0 && <Group>
                        <Link to="/login">
                            <Button variant="default">
                                Log in
                            </Button>
                        </Link>
                        <Link to="/signup">
                            <Button>Sign up</Button>
                        </Link>
                    </Group>}

                    {user.name.length != 0 && <Group className="mr-10">
                        <Menu withArrow>

                            <Menu.Target>
                                <UserButton
                                    name={user.name}
                                    is_student={user.is_student}
                                />
                            </Menu.Target>

                            <Menu.Dropdown>
                                <Menu.Item 
                                    color="red" 
                                    icon={<IconLogout size={14} />}
                                    onClick={logout}
                                >
                                    Log out
                                </Menu.Item>
                            </Menu.Dropdown>

                        </Menu>
                    </Group>}
                </Group>
            </MantineHeader>
        </Box>
    );
}
