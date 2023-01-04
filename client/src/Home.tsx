import { useQuery } from 'react-query';
import { get_projects, type ProjectInfo } from './api';
import ProjectEditor from './ProjectEditor'
import { UserContext } from './context';
import { Skeleton } from '@mantine/core';
import { useContext, useEffect, useRef } from 'react';
import ProjCard from './ProjCard';

export default function Home() {
    const [user, _] = useContext(UserContext);
    const user_id = useRef(user.id);
    const query = useQuery(['projects', user_id], () => get_projects(user_id), {
        refetchOnWindowFocus: false,
        enabled: user_id.current > 0 || localStorage.getItem("token") == null,
    });

    useEffect(() => {
        const current = user_id.current;
        user_id.current = user.id;
        if (current == 0 && user.id > 0) {
            query.refetch();
        }
    });

    return (
        <div className="flex flex-col space-y-5 content-center mt-5 mb-10">
            {user.name.length > 0 && !user.is_student && <ProjectEditor />}
            {query.isFetching && Array.from(Array(10).keys()).map(
                (id) => <Skeleton key={id} width="700px" height="200px" className="mx-auto"/>
            )}
            {!query.isFetching && query.data?.map(
                (proj: ProjectInfo) => <ProjCard 
                    key={proj.project_id} 
                    info={proj} 
                    user_id={null}
                />
            )}
        </div>
    );
}
