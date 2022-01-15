const router = require('express').Router()
const Cart = require('../models/Cart')
const { verifyTokenAndAdmin, verifyTokenAndAuthoriztion, verifyToken } = require('./verifyToken')

//Create
router.post('/', verifyToken, async (req, res)=>{
    const newCart = new Cart(req.body)
    try{
        const savedCart = await newCart.save()
        res.status(200).json(savedCart)
    }catch(e){
        res.status(500).json(e)
    }
})

//Update
router.put('/:id', verifyTokenAndAuthoriztion, async(req, res)=>{
    try{
        const updateCart = await Cart.findByIdAndUpdate(req.params.id,{
            $set: req.body
        },{
            new: true
        })
        res.status(200).json(updateCart)
    } catch(e){
        res.status(500).json(e)
    }
})

//Delete
router.delete("/:id", verifyTokenAndAuthoriztion, async(req, res)=>{
    try{
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json('Cart has been deleted')
    }catch(e){
        res.status(500).json(e)
    }
})

//Get cart
router.get("/find/:userId", verifyTokenAndAuthoriztion, async(req, res)=>{
    try{
        const cart = await Cart.findOne({UserId: req.params.userId})
        res.status(200).json(cart)
    }catch(e){
        res.status(500).json(e)
    }
})

//GET ALL CART
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const carts = await Cart.find() 
        res.status(200).json(carts);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router