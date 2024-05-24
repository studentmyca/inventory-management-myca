const express = require('express');
const Item = require('../models/item');
const router = express.Router();

router.get('/', async (req,res)=>{
  try{
    const item = await Item.find();
    res.json(item);
  }catch(err){
    res.status(500).json({message:err.message});
  }
});

router.get('/:id', getItem,(req,res)=>{
  res.json(res.item);
})

router.post('/', async (req,res)=>{
  try{

    if(!req.body.name || !req.body.quantity){
      return res.status(400).json({message:'Name and quantity are required'})
    }

    const existingItem = await Item.findOne({name: req.body.name});
    if(existingItem){
      return res.status(400).json({message:'Item is already exists'})
    }

    const item = new Item(req.body);
    const newItem = await item.save();

    res
      .status(200)
      .json({message: 'Item created successfully', newItem});
  }catch(err){
    res.status(400).json({message: err.message});
  }
})

router.patch('/:id', getItem, async (req,res)=>{
  try{
    if(req.body.name != null){
      res.item.name = req.body.name;

      const updateItem = await item.save();
      res.json(updateItem);
    }
  }catch(err){
    res.status(400).json({message: err.message});
  }
});

router.put('/:id',getItem, async (req, res)=>{
  try{
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      {new:true}
    );

    res.json(updatedItem);
  }catch(err){
    res.status(400).json({message: err.message});
  }
});

router.delete('/:id', getItem, async (req,res)=>{
  try{
    await Item.findByIdAndDelete(req.params.id);
    res.json({message: 'Item deleted successfully'});
  }catch(err){
    res.status(500).json({message:err.message});
  }
});

async function getItem(req,res,next){
  try{
    const item = await Item.findById(req.params.id);
    if(!item){
      return res.status(404).json({message:'Item not found'});
    }
    res.item = item;
    next();
  }catch(err){
    res.status(500).json({message:err.message});
  }
}

module.exports = router;