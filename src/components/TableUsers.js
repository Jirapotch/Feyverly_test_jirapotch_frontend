import React, { useContext, useEffect, useRef, useState } from 'react'

import { Button, Form, Input, Modal, Popconfirm, Switch, Table, message } from 'antd';
import axios from 'axios';

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
};

export default function TableUsers() {
    const [users, setUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const formRef = useRef(form);

    const getUser = () => {
        axios.get('http://localhost:3001/users', { headers })
            .then(response => setUsers(response.data))
            .catch(error => console.error(error));
    }

    useEffect(() => {
        getUser()
    }, [])

    const defaultColumns = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            editable: true,
            width: '20%',
        },
        {
            title: 'Password',
            dataIndex: 'password',
            key: 'password',
            editable: true,
            width: '20%',
        },
        {
            title: 'Display Name',
            dataIndex: 'display_name',
            key: 'display_name',
            editable: true,
            width: '30%',
        },
        {
            title: 'Active',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (_, record) => (<Switch checked={record.isActive} onChange={() => handleSave({...record, isActive: !record.isActive})} />)
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
                    <a>Delete</a>
                </Popconfirm>
            ),
        },
    ];

    const handleDelete = async (key) => {
        const response = await axios.delete(`http://localhost:3001/users/${key}`, { headers });
        console.log(response.data);
        message.success('Delete user successfully');
        getUser()
    };

    const EditableContext = React.createContext(null);

    const EditableRow = ({ index, ...props }) => {
        const [form] = Form.useForm();
        return (
            <Form form={form} component={false}>
                <EditableContext.Provider value={form}>
                    <tr {...props} />
                </EditableContext.Provider>
            </Form>
        );
    };

    const EditableCell = ({
        title,
        editable,
        children,
        dataIndex,
        record,
        handleSave,
        ...restProps
    }) => {
        const [editing, setEditing] = useState(false);
        const inputRef = useRef(null);
        const form = useContext(EditableContext);
        useEffect(() => {
            if (editing) {
                inputRef.current.focus();
            }
        }, [editing]);
        const toggleEdit = () => {
            setEditing(!editing);
            form.setFieldsValue({
                [dataIndex]: record[dataIndex],
            });
        };
        const save = async () => {
            try {
                const values = await form.validateFields();
                toggleEdit();
                handleSave({
                    ...record,
                    ...values,
                });
            } catch (errInfo) {
                console.log('Save failed:', errInfo);
            }
        };
        let childNode = children;
        if (editable) {
            childNode = editing ? (
                <Form.Item
                    style={{
                        margin: 0,
                    }}
                    name={dataIndex}
                    rules={[
                        {
                            required: true,
                            message: `${title} is required.`,
                        },
                    ]}
                >
                    <Input ref={inputRef} onPressEnter={save} onBlur={save} />
                </Form.Item>
            ) : (
                <div
                    className="editable-cell-value-wrap"
                    style={{
                        paddingRight: 24,
                    }}
                    onClick={toggleEdit}
                >
                    {children}
                </div>
            );
        }
        return <td {...restProps}>{childNode}</td>;
    };

    const handleSave = async (row) => {
        const response = await axios.put(`http://localhost:3001/users/${row.id}`, row, { headers });
        console.log(response.data);
        message.success('Update successfully');
        getUser()
    };

    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });

    const handleAdd = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalOpen(false);
    };

    const onFinish = async (values) => {
        try {
            const response = await axios.post('http://localhost:3001/users', values, { headers });
            console.log(response.data);
            message.success('User created successfully');
            getUser()
            setIsModalOpen(false)
        } catch (error) {
            console.error(error);
            message.error('Error creating user');
        }
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    return <div>
        <Button
            onClick={handleAdd}
            type="primary"
            style={{
                marginBottom: 16,
            }}
        >
            Add a row
        </Button>
        <Modal title="Basic Modal" open={isModalOpen} onOk={() => formRef.current.submit()} onCancel={handleCancel}>
            <Form
                ref={formRef}
                form={form}
                name="addUserForm"
                onFinish={onFinish}
                layout="vertical"
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please enter a username' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please enter a password' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    label="Display Name"
                    name="display_name"
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
        <Table components={components} columns={columns} dataSource={users} />
    </div>
}
