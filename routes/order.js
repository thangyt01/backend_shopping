const router = require('express').Router()
const Order = require('../models/Order')
const { verifyTokenAndAdmin, verifyTokenAndAuthoriztion, verifyToken } = require('./verifyToken')

//Create
router.post('/', verifyToken, async (req, res)=>{
    const newOrder = new Order(req.body)
    try{
        const savedOrder = await newOrder.save()
        res.status(200).json(savedOrder)
    }catch(e){
        res.status(500).json(e)
    }
})

//Update
router.put('/:id', verifyTokenAndAdmin, async(req, res)=>{
    try{
        const updateOrder = await Order.findByIdAndUpdate(req.params.id,{
            $set: req.body
        },{
            new: true
        })
        res.status(200).json(updateOrder)
    } catch(e){
        res.status(500).json(e)
    }
})

//Delete
router.delete("/:id", verifyTokenAndAdmin, async(req, res)=>{
    try{
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json('Order has been deleted')
    }catch(e){
        res.status(500).json(e)
    }
})

//Get order
router.get("/find/:userId", verifyTokenAndAuthoriztion, async(req, res)=>{
    try{
        const orders = await Order.find({UserId: req.params.userId})
        res.status(200).json(orders)
    }catch(e){
        res.status(500).json(e)
    }
})

//GET ALL PRODUCT
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const orders = await Order.find() 
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET MONTHLY INCOME

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const productId = req.query.pid
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  
    try {
    const income = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: previousMonth },
          ...(productId && {
            products: { $elemMatch: { productId } },
          }),
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router