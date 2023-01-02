import { Badge, Text } from '@mantine/core';

interface UserInfoProps {
    name: string;
    is_student: boolean;
}

export default function UserInfo(props: UserInfoProps) {
    const { is_student, name } = props;
    return (
        <div className="flex flex-col">
            <Badge size="xs" color={is_student ? "green" : "blue"}>{is_student ? "Student" : "Teacher"}</Badge>

            <Text size="sm" weight={500}>
                {name}
            </Text>
        </div>
    )
}
