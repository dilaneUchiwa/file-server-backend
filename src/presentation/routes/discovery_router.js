const express=require('express');
const { discovery } = require('../../domain/use-cases/discovery/get_files');

const router=express.Router();

router.post('/',discovery);

module.exports=router;