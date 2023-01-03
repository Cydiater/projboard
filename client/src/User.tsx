import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { UserContext } from './context';
import { useContext } from 'react';
import { get_projects_for, type ProjectInfo } from './api';
import ProjCard from './ProjCard';
import ProjectEditor from './ProjectEditor';
import { Skeleton } from '@mantine/core';

export default function User() {
    const { user_id } = useParams();
    const query = useQuery(`projects_for_${user_id}`, () => get_projects_for(+user_id!), {
        refetchOnWindowFocus: false,
    });
    const [user, _dispatch] = useContext(UserContext);

    return (
        <div className="flex flex-col space-y-5 content-center mt-5 mb-10">
            {user.name.length > 0 && !user.is_student && +user_id! == user.id && <ProjectEditor user={user.id}/>}
            {query.isFetching && Array.from(Array(10).keys()).map(
                (id) => <Skeleton key={id} width="700px" height="200px" className="mx-auto"/>
            )}
            {!query.isFetching && query.data?.map(
                (proj: ProjectInfo) => <ProjCard key={proj.project_id} info={proj} user_id={user.id}/>
            )}
        </div>
    );
}
