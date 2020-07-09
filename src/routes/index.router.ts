const express = require('express');
export const index = express.Router();

index.get('/', (req, res) =>{
    console.log('get index');
    res.send('geting index');
});
