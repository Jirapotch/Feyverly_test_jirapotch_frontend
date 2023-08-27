import { useState, useEffect, useReducer } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

import { Breadcrumb, Button, Layout, Menu, theme } from 'antd';
import { HomeOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';

import AuthProvider, { userReducer, userState } from '../context/AuthContext';

const { Header, Content } = Layout;

export default function MainPage() {
    const navigate = useNavigate()
    let loca = useLocation()
    const token = localStorage.getItem('token')
    const [stateUser, dispatchUser] = useReducer(userReducer, userState)

    const [selectmenu, setSelectmenu] = useState('home')

    useEffect(() => {
        if (token) {
            const decodedToken = jwtDecode(token);
            dispatchUser({ type: "GET_USER", payload: decodedToken.name })
        }
    }, []);

    useEffect(() => {
        setSelectmenu(loca.pathname)
    }, [loca])


    return (
        <AuthProvider.Provider value={{ state: stateUser }}>
            <div>
                <Layout className="layout">
                    <Header
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-around',
                            position: 'sticky',
                            top: 0,
                            zIndex: 100,
                        }}
                    >
                        <Menu
                            theme="dark"
                            mode="horizontal"
                            selectedKeys={selectmenu}
                            style={{ width: '90%' }}
                            items={[
                                {
                                    key: '/',
                                    label: 'Home',
                                    icon: <HomeOutlined />,
                                    onClick: () => navigate("/")
                                },
                                {
                                    key: '/setting',
                                    label: 'Setting',
                                    icon: <SettingOutlined />,
                                    onClick: () => navigate("/setting")
                                }
                            ]}
                        />
                        <Button
                            icon={<LogoutOutlined />}
                            onClick={() => {
                                localStorage.clear()
                                dispatchUser({ type: "GET_USER", payload: '' })
                                navigate("/login")
                            }}
                        >
                            Logout
                        </Button>
                    </Header>
                    <Content style={{ minHeight: 'calc(100vh - 64px)' }}>
                        <Outlet />
                    </Content>
                </Layout>
            </div>
        </AuthProvider.Provider>
    )
}
