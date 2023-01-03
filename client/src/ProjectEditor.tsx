import { useState, useContext } from 'react';
import { Paper, Button, Collapse, TextInput, Textarea } from '@mantine/core';
import UserInfo from './UserInfo';
import { UserContext } from './context';
import { create_project } from './api';
import { useMutation } from 'react-query';
import { showNotification } from '@mantine/notifications';
import { useQueryClient } from 'react-query';

export default function ProjectEditor(props: any) {
    const [opened, setOpened] = useState(false);
    const [user, _] = useContext(UserContext);
    const [title, setTitle] = useState("");
    const [info, setInfo] = useState("");
    const queryClient = useQueryClient();
    const queryInvalidateKey = !!props.user ? `projects_for_${props.user!}` : "projects";

    interface SubmitArg {
        title: string;
        info: string;
        user_id: number;
    }

    const do_submit = useMutation({
        mutationFn: async ({title, info, user_id}: SubmitArg) => await create_project(user_id, title, info),
        onSuccess: () => {
            showNotification({
                message: "Submit succeed",
            });
            queryClient.invalidateQueries(queryInvalidateKey);
        },
        onError: (e: Error) => {
            showNotification({
                title: "Submit failed",
                message: e.message,
                color: "red",
            })
        }
    });

    return (
        <Paper withBorder sx={{ width: "700px" }} 
            className="mx-auto p-2"
        >
            <div className="flex">
                <Button variant="subtle" onClick={() => setOpened(!opened)}>
                    {opened ? "HIDE EDITOR" : "SHOW EDITOR"}
                </Button>
                <div className="grow" />
                <UserInfo name={user.name} is_student={user.is_student} id={user.id}/>
            </div>
            <Collapse in={opened} className="p-2">
                <TextInput placeholder='Title' variant="filled" className="my-2" value={title} onChange={(e) => setTitle(e.target.value)}/>
                <Textarea placeholder="Content" variant="filled" minRows={10} value={info} onChange={(e) => setInfo(e.target.value)}/>
                <div className="flex mt-2">
                    <div className="grow"/>
                    <Button  loading={do_submit.isLoading} size="sm" variant="light" onClick={() => do_submit.mutate({title, info, user_id: user.id})}>
                        Submit
                    </Button>
                </div>
            </Collapse>
        </Paper>
    );
}
