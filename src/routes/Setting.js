import React from 'react'

import { Tabs } from 'antd';
import TableUsers from '../components/TableUsers';
import TableShops from '../components/TableShops';


export default function Setting() {
    const onChange = (key) => {
        console.log(key);
    };

    return (
        <div style={{ padding: '20px' }}>
            <Tabs
                type="card"
                size='large'
                defaultActiveKey="1"
                items={[
                    {
                        key: '1',
                        label: 'Users',
                        children: <TableUsers />,
                    },
                    {
                        key: '2',
                        label: 'Shops',
                        children: <TableShops />,
                    }
                ]}
                onChange={onChange}
            />
        </div>
    )
}
