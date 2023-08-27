import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { Form, Input, Button, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title } = Typography;

const containerStyle = {
    width: '300px',
    margin: 'auto',
    padding: '20px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '5px',
    marginTop: '100px',
};

const buttonStyle = {
    width: '100%',
};

export default function Login() {
    const navigate = useNavigate();

    const onFinish = (values) => {
        axios.post('http://localhost:3001/auth/login', values)
            .then(response => {
                localStorage.setItem('token', response.data.token)
                navigate("/")
            })
            .catch(error => console.error(error));

    };

    return (
        <div style={containerStyle}>
            <Title level={3}>Login</Title>
            <Form
                name="normal_login"
                onFinish={onFinish}
            >
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Please input your Username!' }]}
                >
                    <Input prefix={<UserOutlined />} placeholder="Username" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                    <Input
                        prefix={<LockOutlined />}
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={buttonStyle}>
                        Log in
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}
