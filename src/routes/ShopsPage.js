import { useState, useEffect, useContext } from 'react'
import axios from 'axios';

import { Card, Col, Row, Typography } from 'antd';

import AuthContext from '../context/AuthContext';

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  };


const headerStyle = {
    backgroundColor: '#324f62',
    color: '#fff',
    textAlign: 'center',
    padding: '50px'
};

export default function ShopsPage() {
    const { state: stateUser } = useContext(AuthContext)
    const [shops, setShops] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/shops', { headers })
            .then(response => setShops(response.data))
            .catch(error => console.error(error));
    }, [])
    

    return (
        <div>
            <div style={headerStyle}>
                <h2>Hello {stateUser.username}</h2>
                <h1>Welcome to my website</h1>
                <p>Explore our featured shops</p>
            </div>
            <div style={{ padding: '20px' }}>
                <Row gutter={[12, 12]}>
                    {shops.map((shop, index) => (
                        <Col span={12} key={index}>
                            <Card title={shop.name} bordered={false}>
                                <Typography>{shop.description}</Typography>
                                <p>lat: {shop.lat}</p>
                                <p>lng: {shop.lng}</p>
                                <div style={{ width: "100%", height: "300px", marginTop: '20px' }}>
                                    <iframe
                                        title="Shop Map"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyCrZsWLuEH5WQzpB8tLF_pd0zY15oUMJPY&q=${shop.lat},${shop.lng}`}
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>
        </div >
    )
}
