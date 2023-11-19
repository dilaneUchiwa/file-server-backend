const express=require('express');
const { read_video } = require('../../domain/use-cases/read/read_video');

const router=express.Router();

router.get('/video',read_video);

module.exports=router;