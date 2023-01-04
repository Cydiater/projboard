import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useState, useContext } from 'react';
import { IconTrash } from '@tabler/icons';
import TimeAgo from 'javascript-time-ago'
import { 
    get_discussions_for, 
    get_project_for, 
    delete_project, 
    update_project_for,
    create_discussion_for,
    delete_discussion,
    type DiscussionInfo,
} from './api';
import { UserContext } from './context';
import { 
    Paper, 
    TextInput, 
    Textarea, 
    Button, 
    Divider, 
    Collapse,
    Text,
} from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import UserInfo from './UserInfo';

export default function Project() {
    const { search } = useLocation();
    const parameters = new URLSearchParams(search);
    const edit_mode = parameters.get('edit_mode');
    const { user_id, project_id } = useParams();
    const uid = +user_id!;
    const pid = +project_id!;
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [info, setInfo] = useState("");
    const [editing, setEditing] = useState<boolean>(edit_mode == "true" ? true : false);
    const [discuss, setDiscuss] = useState("");
    const [opened, setOpened] = useState(false);
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

    const titleDisableStyle = () => ({
        color: "black !important",
        fontWeight: 700,
        fontSize: "26px !important",
        cursor: "default !important",
        opacity: "100 !important",
    });

    const infoDisableStyle = () => ({
        color: "black !important",
        cursor: "default !important",
        opacity: "100 !important",
    });

    interface UpdateArg {
        user_id: number;
        project_id: number;
        title: string;
        info: string;
    }

    const do_update = useMutation((a: UpdateArg) => update_project_for(a.user_id, a.project_id, a.title, a.info), {
        onSuccess: () => {
            showNotification({
                message: "Update succeed"
            });
            queryClient.invalidateQueries("project");
            setEditing(false);
        },
        onError: (e: Error) => {
            showNotification({
                title: "Update failed",
                message: e.message,
                color: 'red',
            });
        }
    });

    interface DeleteArg {
        user_id: number;
        project_id: number;
    }

    const do_delete = useMutation((a: DeleteArg) => delete_project(a.user_id, a.project_id), {
        onSuccess: () => {
            showNotification({
                message: "Delete succeed"
            });
            navigate("/");
        },
        onError: (e: Error) => {
            showNotification({
                title: "Delete failed",
                message: e.message,
                color: "red",
            })
        }
    });

    interface SubmitDiscussArg {
        user_id: number;
        project_id: number;
        content: string;
    }

    const do_submit_discuss = useMutation((a: SubmitDiscussArg) => create_discussion_for(a.user_id, a.project_id, a.content), {
        onSuccess: () => {
            showNotification({
                message: "Submit discussion succeed",
            });
            queryClient.invalidateQueries("discussions")
        },
        onError: (e: Error) => {
            showNotification({
                title: "Submit discussion failed",
                message: e.message,
                color: "red",
            })
        }
    });

    interface DiscussionProps {
        info: DiscussionInfo;
    }

    const Discussion = (props: DiscussionProps) => {
        const { info } = props;
        const timeAgo = new TimeAgo('en-US');
        const ago_text = timeAgo.format(new Date(info.created_at));
        interface DeleteArg {
            user_id: number;
            id: number;
        }
        const do_delete = useMutation((a: DeleteArg) => delete_discussion(a.user_id, a.id), {
            onSuccess: () => {
                showNotification({
                    message: "Delete discussion succeed",
                });
                queryClient.invalidateQueries("discussions");
            },
            onError: (e: Error) => {
                showNotification({
                    title: "Delete discussion failed",
                    message: e.message,
                    color: 'red',
                });
            }
        });
        return (
            <Paper withBorder className="p-3" sx={{ width: "700px" }}>
                <div className="flex items-center">
                    <Text c="dimmed" fz="sm" fs="italic">
                        {ago_text}
                    </Text>
                    <div className="grow"/>
                    {user.id == info.user_id && (
                        <Button 
                            size="xs" 
                            className="mr-3" 
                            color="red" 
                            variant="subtle" 
                            loading={do_delete.isLoading}
                            onClick={() => do_delete.mutate({
                                user_id: info.user_id,
                                id: info.id,
                            })}
                            leftIcon={<IconTrash />} 
                        />
                    )}
                    <UserInfo 
                        id={info.user_id}
                        name={info.user_name}
                        is_student={info.user_is_student}
                    />
                </div>
                <Text className="mt-2">
                    {info.content}
                </Text>
            </Paper>
        )
    }

    return (
        <div className='flex flex-col my-5 space-y-3 items-center'>
            <Paper 

                className="flex flex-col space-y-2 p-2 mx-auto"
                sx={{
                    width: "750px",
                }}
            >
                <div className="flex space-x-3 content-center items-center">
                    <TextInput 
                        disabled={!editing}
                        variant="filled" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        size="lg"
                        className="grow"
                        styles={() => ({
                            disabled: titleDisableStyle(),
                        })}
                    />
                    {projectQuery.isSuccess && <UserInfo 
                        is_student={projectQuery.data.user_is_student}
                        name={projectQuery.data.user_name}
                        id={projectQuery.data.user_id}
                    />}
                </div>
                <Textarea 
                    autosize
                    disabled={!editing}
                    variant="filled"
                    value={info}
                    onChange={(e) => setInfo(e.target.value)}
                    minRows={7}
                    styles={() => ({
                        disabled: infoDisableStyle(),
                    })}
                    className="text-black"
                />
                {uid == user.id && <div className="flex space-x-2">
                    <Button 
                        size="sm" 
                        variant="light" 
                        color="red" 
                        loading={do_delete.isLoading}
                        onClick={() => do_delete.mutate({user_id: uid, project_id: pid})}
                    >
                        Delete
                    </Button>
                    <div className="grow" />
                    {!editing && <Button size="sm" variant="light" onClick={() => setEditing(true)}>
                        Edit
                    </Button>}
                    {editing && <Button size="sm" variant="light" onClick={() => {
                        setEditing(false);
                        if (!!projectQuery.data) {
                            setTitle(projectQuery.data.title);
                            setInfo(projectQuery.data.info);
                        }
                        }}>
                        Cancel
                    </Button>}
                    {editing && <Button 
                        size="sm" 
                        variant="light" 
                        loading={do_update.isLoading}
                        onClick={() => do_update.mutate({user_id: uid, project_id: pid, title, info})}>
                        Submit
                    </Button>}
                </div>}
            </Paper>

            <Divider sx={{ width: "700px" }} label="Discussions" labelPosition="center" />

            <Paper withBorder sx={{ width: "700px" }} className="p-2">
                <div className="flex">
                    <Button variant="light" onClick={() => setOpened(!opened)}>
                        SHOW EDITOR
                    </Button>
                    <div className="grow"/>
                    <UserInfo 
                        id={user.id}
                        name={user.name}
                        is_student={user.is_student}
                    />
                </div>
                <Collapse in={opened} className="mt-2">
                    <Textarea autosize minRows={4} variant="filled" value={discuss} onChange={(e) => setDiscuss(e.target.value)}/>
                    <div className="flex">
                        <div className="grow"/>
                        <Button 
                            size="xs" 
                            className="mt-2"
                            variant="light"
                            loading={do_submit_discuss.isLoading}
                            onClick={() => do_submit_discuss.mutate({
                                user_id: user.id,
                                project_id: pid,
                                content: discuss,
                            })}
                        >
                            Submit
                        </Button>
                    </div>
                </Collapse>
            </Paper>

            {discussionsQuery.data?.map((info) => (<Discussion info={info} key={info.id}/>))}

        </div>)
}
