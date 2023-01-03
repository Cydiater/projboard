import { Badge, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

interface UserInfoProps {
    id: number;
    name: string;
    is_student: boolean;
}

export default function UserInfo(props: UserInfoProps) {
    const { is_student, name, id } = props;
    const navigate = useNavigate();

    return (
        <div 
            className="flex flex-col cursor-pointer" 
            onClick={() => navigate(`/users/${id}`)}
        >
            <Badge size="xs" color={is_student ? "green" : "blue"}>{is_student ? "Student" : "Teacher"}</Badge>

            <Text size="sm" weight={400} align="center">
                {name}
            </Text>
        </div>
    )
}
