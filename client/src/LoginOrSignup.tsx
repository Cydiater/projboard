import {
    TextInput,
    PasswordInput,
    Checkbox,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import { create_user } from './api';
import { useState } from 'react';
import { useMutation } from 'react-query';
import { showNotification } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth';

interface Prop {
    login: boolean,
}

export default function LoginOrSignup(prop: Prop) {
    interface signup_arg  {
        username: string;
        password: string;
        is_student: boolean;
    }

    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isStudent, setIsStudent] = useState(true);

    const do_signup = useMutation({
        mutationFn: ({username, password, is_student}: signup_arg) => 
        create_user(username, password, is_student),
        onSuccess: () => {
            showNotification({
                message: "Sign up succeed"
            });
            navigate("/login");
        },
        onError: (error: Error) => {
            showNotification({
                color: 'red',
                title: "Sign up failed",
                message: error.message,
            });
        },
    });

    const { do_login } = useAuth();

    return (
        <Container size={420} my={40}>
            <Title
                align="center"
                sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
            >
                {prop.login ? "Welcome back!" : "Welcom to Projboard!"}
            </Title>


            {prop.login && <Text color="dimmed" size="sm" align="center" mt={5}>
                Do not have an account yet?{' '}

                <Link to="/signup" className="no-underline">
                    <Text span size="sm" color="blue">
                        Create account
                    </Text>
                </Link>
            </Text>}

            {!prop.login && <Text color="dimmed" size="sm" align="center" mt={5}>
                Alreay have an account?{' '}
                <Link to="/login" className="no-underline">
                    <Text span size="sm" color="blue">
                        Login
                    </Text>
                </Link>
            </Text>}

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <TextInput label="Username" placeholder="Turing" required value={username} onChange={e => setUsername(e.currentTarget.value)}/>
                <PasswordInput label="Password" placeholder="Your password" required mt="md" value={password} onChange={e => setPassword(e.currentTarget.value)}/>

                {!prop.login && <Group position="apart" mt="lg">
                    <Checkbox label="I am a student" sx={{ lineHeight: 1 }} checked={isStudent} onChange={e => setIsStudent(e.currentTarget.checked)}/>
                </Group>}

                {prop.login && 
                    <Button 
                        fullWidth 
                        mt="xl"
                        loading={do_login.isLoading}
                        onClick={() => do_login.mutate({username, password})}
                    >
                        Login
                    </Button>}

                {!prop.login && 
                    <Button 
                        fullWidth mt="xl" 
                        loading={do_signup.isLoading}
                        onClick={() => do_signup.mutate({username, password, is_student: isStudent} as signup_arg)}>
                        Sign up
                    </Button>}
            </Paper>
        </Container>
    );
}
