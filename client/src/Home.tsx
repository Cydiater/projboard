import { useQuery } from 'react-query';
import { get_projects, type ProjectInfo } from './api';
import ProjectEditor from './ProjectEditor'
import { UserContext } from './context';
import { Skeleton } from '@mantine/core';
import { useContext } from 'react';
import ProjCard from './ProjCard';

export default function Home() {
    const query = useQuery('projects', get_projects, {
        refetchOnWindowFocus: false,
    });
    const [user, _] = useContext(UserContext);

    return (
        <div className="flex flex-col space-y-5 content-center mt-5">
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
