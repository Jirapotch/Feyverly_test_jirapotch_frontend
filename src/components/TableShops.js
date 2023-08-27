import React, { useContext, useEffect, useRef, useState } from 'react'

import { Button, Form, Input, Modal, Popconfirm, Switch, Table, message } from 'antd';
import axios from 'axios';

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
};

export default function TableShops() {
    const [shops, setShops] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const formRef = useRef(form);

    const getShop = () => {
        axios.get('http://localhost:3001/shops', { headers })
            .then(response => setShops(response.data))
            .catch(error => console.error(error));
    }

    useEffect(() => {
        getShop()
    }, [])

    const defaultColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            editable: true,
            width: '20%',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            editable: true,
            width: '20%',
        },
        {
            title: 'Latitude',
            dataIndex: 'lat',
            key: 'lat',
            editable: true,
            width: '20%',
        },
        {
            title: 'longitude',
            dataIndex: 'lng',
            key: 'lng',
            editable: true,
            width: '20%',
        },
        {
            title: 'Active',
            dataIndex: 'isActive',
            key: 'isActive',
            render: (_, record) => (<Switch checked={record.isActive} onChange={() => handleSave(record)} />)
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
        const response = await axios.delete(`http://localhost:3001/shops/${key}`, { headers });
        console.log(response.data);
        message.success('Delete shop successfully');
        getShop()
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
        const response = await axios.put(`http://localhost:3001/shops/${row.id}`, row, { headers });
        console.log(response.data);
        message.success('Update successfully');
        getShop()
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
            const response = await axios.post('http://localhost:3001/shops', values, { headers });
            console.log(response.data);
            message.success('Shop created successfully');
            getShop()
            setIsModalOpen(false)
        } catch (error) {
            console.error(error);
            message.error('Error creating shop');
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
                name="addShopForm"
                onFinish={onFinish}
                layout="vertical"
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please enter a name' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Description"
                    name="description"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Latitude"
                    name="lat"
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="longitude"
                    name="lng"
                >
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
        <Table components={components} columns={columns} dataSource={shops} />
    </div>
}
