import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useState, useContext } from 'react';
import { get_discussions_for, get_project_for } from './api';
import { UserContext } from './context';
import { Paper, TextInput, Textarea, Button } from '@mantine/core';

interface ProjectProps {

}

export default function Project(props: ProjectProps) {
    const { user_id, project_id } = useParams();
    const uid = +user_id!;
    const pid = +project_id!;
    const [title, setTitle] = useState("");
    const [info, setInfo] = useState("");
    const [editing, setEditing] = useState(false);
    const [user, _dispatchUser] = useContext(UserContext);
    const projectQuery = useQuery('project', () => get_project_for(uid, pid), {
        refetchOnWindowFocus: false,
        onSuccess: (data) => {
            setTitle(data.title);
            setInfo(data.info);
        }
    })
    const discussionsQuery = useQuery('discussions', () => get_discussions_for(uid, pid), {
        refetchOnWindowFocus: false,
    });

    const titleDisableStyle = {
        color: "black !important",
        fontWeight: 900,
        fontSize: "1.125rem !important",
    };

    return (
        <div className='flex flex-col mt-3'>
            <Paper 
                withBorder 
                className="flex flex-col space-y-2 p-2 mx-auto"
                sx={{
                    width: "700px",
                }}
            >
                <TextInput 
                    disabled={!editing}
                    variant="filled" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    size="lg"
                    styles={{
                        'disabled': titleDisableStyle
                    }}
                />
                <Textarea 
                    disabled={!editing}
                    variant="filled"
                    value={info}
                    onChange={(e) => setInfo(e.target.value)}
                    className="text-black"
                />
                {uid == user.id && <div className="flex">
                    <div className="grow" />
                    <Button size="sm" variant="light" onClick={() => setEditing(!editing)}>
                        Edit
                    </Button>
                </div>}
            </Paper>
            <div>
                {JSON.stringify(projectQuery.data)}
            </div>
            <div>
                {JSON.stringify(discussionsQuery.data)}
            </div>
        </div>)
}
