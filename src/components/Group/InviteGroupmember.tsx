import { Badge, Button, Divider, Modal, Input, Select, SelectProps } from "antd";
import GroupmemberCourses from "./GroupmemberCourses";
import "./GroupmemberCourses.css"
import { Group, GroupInvitationWsTo, Groupmember, SendInvitationWsTo, User } from "../../interfaces";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Plus } from "react-bootstrap-icons";
import Groupuser from "./Groupuser";
import { SearchProps } from "antd/es/input/Search";
import { fetchWrapper } from "../../api/helper";

interface InviteGroupProps {
    groupId: number | undefined;
}

const InviteGroupmember = forwardRef((props: InviteGroupProps, ref) => {

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const [options, setOptions] = useState<SelectProps['options']>([]);
    const [invitations, setInvitations] = useState<String[]>([]);

    const [users, setUsers] = useState<User[]>([]);

    const handleChange = (value: string[]) => {
        setInvitations(value);
        console.log(`selected ${value}`);
    };

    const showModal = () => {
        setOpen(true);
    };

    const handleOk = () => {
        setLoading(true);
        setTimeout(() => {
            let invitationWsTos: SendInvitationWsTo[] = [];
            console.log(invitations);
            invitations.forEach(element => {
                invitationWsTos.push({ userEmail: element.toString(), groupId: props.groupId })
            });
            fetchWrapper.post(`api/v1/groups/invitations`, invitationWsTos).then(res => {
                console.log(res.messages[0].message);
            })
            setLoading(false);
            setOpen(false);
        }, 3000);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    useImperativeHandle(ref, () => ({
        openDialog() {
            showModal();
        }
    }));

    useEffect(() => {
        const fetchedUsers = fetchWrapper.get(`api/v1/users/all`).then(res => {
            setUsers(res.payload);
        });
        const options: SelectProps['options'] = []
        Promise.all([fetchedUsers]).then(() => {
            users.forEach(user => {
                options.push({
                    label: user.name,
                    value: user.email,
                    disabled: false,
                })
            });
            setOptions(options);
        });
    }, [open]);

    return (
        <div>
            <Modal
                open={open}
                title="Gruppenmitglieder hinzufügen"
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="submit" loading={loading} onClick={handleCancel}>
                        Abbrechen
                    </Button>,
                    <Button
                        type="primary"
                        loading={loading}
                        onClick={handleOk}
                    >
                        Mitglieder einladen
                    </Button>,
                ]}
            >
                <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="Nutzer suchen"
                    defaultValue={[]}
                    onChange={handleChange}
                    options={options}
                />
            </Modal>
        </div>
    )
});

export default InviteGroupmember;