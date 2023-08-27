import React from 'react';
import {
    Routes,
    Route,
    BrowserRouter,
} from "react-router-dom";

import MainPage from './routes/MainPage'
import ShopsPage from './routes/ShopsPage'
import Setting from './routes/Setting'
import Login from './routes/Login';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />}>
                    <Route index element={<ShopsPage />} />
                    <Route path='/setting' element={<Setting />} />
                </Route>
                <Route path='/login' element={<Login />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;