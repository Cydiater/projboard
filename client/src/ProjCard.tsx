import UserInfo from './UserInfo';
import TimeAgo from 'javascript-time-ago'
import { createStyles, Button, Paper, Title, Divider, Text, ActionIcon } from '@mantine/core';
import { type ProjectInfo, delete_project, create_attention, delete_attention } from './api';
import { IconStar } from '@tabler/icons';
import { useContext } from 'react';
import { UserContext } from './context';
import { useMutation, useQueryClient } from 'react-query';
import { showNotification } from '@mantine/notifications';
import { useNavigate } from 'react-router-dom';

interface ProjCardProps {
    info: ProjectInfo;
    user_id: number | null;
}

const useStyles = createStyles(() => ({
    paper: {
        width: "700px",
        height: "200px",
        margin: "auto",
        padding: "10px",
        display: 'flex',
        flexDirection: 'column'
    }
}));

export default function(props: ProjCardProps) {
    const { classes } = useStyles();
    const navigate = useNavigate();
    const { info } = props;
    const timeAgo = new TimeAgo('en-US');
    const created_time = new Date(info.project_created_at);
    const ago_text = timeAgo.format(created_time);
    const [user, _dispatchUser] = useContext(UserContext);
    const writable = () => user.id == info.user_id;
    const queryClient = useQueryClient();
    const queryInvalidateKey = !!props.user_id ? `projects_for_${props.user_id!}` : "projects";
    interface DeleteArg {
        user_id: number;
        project_id: number;
    }
    const do_delete = useMutation((a: DeleteArg) => delete_project(a.user_id, a.project_id), {
        onSuccess: () => {
            showNotification({
                message: "Delete succeed"
            });
            queryClient.invalidateQueries(queryInvalidateKey);
        },
        onError: (e: Error) => {
            showNotification({
                title: "Delete failed",
                message: e.message,
                color: "red",
            })
        }
    });

    interface FollowArg {
        user_id: number;
        project_id: number;
    }

    const do_follow = useMutation((a: FollowArg) => create_attention(a.user_id, a.project_id), {
        onSuccess: () => {
            showNotification({
                message: "Follow succeed",
            });
            queryClient.invalidateQueries(queryInvalidateKey);
        },
        onError: (e: Error) => {
            showNotification({
                title: "Follow failed",
                message: e.message,
                color: 'red',
            });
        }
    })

    interface UnfollowArg {
        user_id: number;
        attention_id: number;
    }

    const do_unfollow = useMutation((a: UnfollowArg) => delete_attention(a.user_id, a.attention_id), {
        onSuccess: () => {
            showNotification({
                message: "Unfollow succeed",
            });
            queryClient.invalidateQueries(queryInvalidateKey);
        },
        onError: (e: Error) => {
            showNotification({
                title: "Unfollow failed",
                message: e.message,
                color: 'red',
            });
        }
    })

    return (
        <Paper withBorder className={classes.paper}>
            <div className="flex items-center mb-2">
                <Title 
                    order={2} 
                    className="cursor-pointer" 
                    onClick={
                        () => navigate(`/users/${info.user_id}/projects/${info.project_id}`)
                    }>
                    {info.title}
                </Title>
                <div className="grow"/>
                <UserInfo name={info.user_name} is_student={false} id={info.user_id}/>
            </div>
            <Divider />
            <Text 
                className="p-1 my-1 overflow-hidden text-gray-700"
                lineClamp={4}
            >
                {info.info}
            </Text>
            <div className="grow" />
            <div className="flex space-x-3 items-center">
                {user.name.length> 0 && (
                    <ActionIcon 
                        variant={info.attention_id > 0 ? "filled" : "subtle"} 
                        size="sm" 
                        loading={do_follow.isLoading || do_unfollow.isLoading}
                        className="ml-3"
                        onClick={() => {
                                if (info.attention_id > 0) {
                            do_unfollow.mutate({user_id: user.id, attention_id: info.attention_id})
                        } else {
                            do_follow.mutate({user_id: user.id, project_id: info.project_id})
                        }}}
                    >
                        <IconStar />
                    </ActionIcon>)}
                {writable() && 
                    <Button variant="subtle" size="xs"
                        onClick={() => navigate(`/users/${info.user_id}/projects/${info.project_id}?edit_mode=true`)}
                    >
                        Edit
                    </Button>}
                {writable() && 
                    <Button 
                        variant="subtle" 
                        size="xs" 
                        color="red"
                        loading={do_delete.isLoading}
                        onClick={() => do_delete.mutate({
                            user_id: info.user_id,
                            project_id: info.project_id,
                        })}
                    >
                        Delete
                    </Button>}
                <div className='grow'/>
                <Text c="dimmed" fz="sm" fs="italic">
                    {`${ago_text}, ${info.attention_count} follows`}
                </Text>
            </div>
        </Paper>
    )
}
