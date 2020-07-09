const express = require('express');
export const routerApi = express.Router();

routerApi.get('/test', (req, res) =>{
    console.log('test api');
    res.send('api ok');
});

