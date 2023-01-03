import {
    Header as MantineHeader,
    Group,
    Button,
    Box,
    UnstyledButton,
    Menu,
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
    user_id: number;
    icon?: React.ReactNode;
}

const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
    ({ name, is_student, user_id, icon, ...others }: UserButtonProps, ref) => (
        <UnstyledButton
            ref={ref}
            {...others}
        >
            <Group>
                <div style={{ flex: 1 }}>
                    <UserInfo id={user_id} name={name} is_student={is_student} />
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

interface LinkButtonProps {
    link: string;
    label: string;
    active: string;
    setActive: (arg0: string) => void,
}

const LinkButton = (props: LinkButtonProps) => {
    const { classes, cx } = useStyles();
    const { link, label, active, setActive } = props;
    const navigate = useNavigate();
    return (

        <a
            key={label}
            href={link}
            className={cx(classes.link, { [classes.linkActive]: active === label })}
            onClick={(event) => {
                event.preventDefault();
                setActive(label);
                navigate(link);
            }}
        >
            {label}
        </a>
    )

}

export function Header() {
    const [user, _dispatchUser] = useContext(UserContext);
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [active, setActive] = useState("Home");

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
                        <LinkButton link="/" label="Home" active={active} setActive={setActive}/>
                        <LinkButton link={`/users/${user.id}`} label="My Projects" active={active} setActive={setActive}/>
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
                                    user_id={user.id}
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
