import { useQuery } from 'react-query';
import { get_projects, type ProjectInfo } from './api';
import UserInfo from './UserInfo';
import ProjectEditor from './ProjectEditor'
import { createStyles, Skeleton, Paper, Title, Divider, Text } from '@mantine/core';
import en from 'javascript-time-ago/locale/en'
import TimeAgo from 'javascript-time-ago'

TimeAgo.addDefaultLocale(en)

interface ProjCardProps {
    info: ProjectInfo
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

const ProjCard = (props: ProjCardProps) => {
    const { classes } = useStyles();
    const { info } = props;
    const timeAgo = new TimeAgo('en-US');
    const created_time = new Date(info.project_created_at);
    const ago_text = timeAgo.format(created_time);
    return (
        <Paper withBorder className={classes.paper}>
            <div className="flex content-center justify-content-center mb-2">
                <Title order={2}>
                    {info.title}
                </Title>
                <div className="grow"/>
                <UserInfo name={info.user_name} is_student={false}/>
            </div>
            <Divider />
            <Text className="p-1 my-1 overflow-hidden text-gray-700" lineClamp={4}>
                {info.info}
            </Text>
            <div className="grow" />
            <div className="flex">
                <div className='grow'/>
                <Text c="dimmed" fz="sm" fs="italic">
                    {ago_text}
                </Text>
            </div>
        </Paper>
    )
}

export default function Home() {
    const query = useQuery('projects', get_projects);

    return (
        <div className="flex flex-col space-y-5 content-center mt-5">
            <ProjectEditor />
            {query.isLoading && Array.from(Array(10).keys()).map(
                (id) => <Skeleton key={id} width="700px" height="200px" className="mx-auto"/>
            )}
            {!query.isLoading && query.data?.map(
                (proj: ProjectInfo) => <ProjCard key={proj.project_id} info={proj}/>
            )}
        </div>
    );
}
