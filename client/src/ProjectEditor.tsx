import { useState, useContext } from 'react';
import { Paper, Button, Collapse } from '@mantine/core';
import UserInfo from './UserInfo';
import { UserContext } from './context';

export default function ProjectEditor() {
    const [opened, setOpened] = useState(false);
    const [user, _] = useContext(UserContext);

    return (
        <Paper withBorder sx={{ width: "700px" }} 
            className="mx-auto p-2"
        >
            <div className="flex">
                <Button variant="subtle" onClick={() => setOpened(!opened)}>
                    {opened ? "HIDE EDITOR" : "SHOW EDITOR"}
                </Button>
                <div className="grow" />
                <UserInfo name={user.name} is_student={user.is_student}/>
            </div>
            <Collapse in={opened}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt nulla quam aut sed
                corporis voluptates praesentium inventore, sapiente ex tempore sit consequatur debitis
                non! Illo cum ipsa reiciendis quidem facere, deserunt eos totam impedit. Vel ab, ipsum
                veniam aperiam odit molestiae incidunt minus, sint eos iusto earum quaerat vitae
                perspiciatis.
            </Collapse>
        </Paper>
    );
}
