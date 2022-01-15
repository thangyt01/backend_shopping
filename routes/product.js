const Product = require('../models/Product')
const { verifyTokenAndAdmin, verifyTokenAndAuthoriztion } = require('./verifyToken')
const router = require('express').Router()

//Create
router.post('/', verifyTokenAndAdmin, async (req, res)=>{
    const newProduct = new Product(req.body)
    try{
        const savedProduct = await newProduct.save()
        res.status(200).json(savedProduct)
    }catch(e){
        res.status(500).json(e)
    }
})

//Update
router.put('/:id', verifyTokenAndAdmin, async(req, res)=>{
    try{
        const updateProduct = await Product.findByIdAndUpdate(req.params.id,{
            $set: req.body
        },{
            new: true
        })
        res.status(200).json(updateProduct)
    } catch(e){
        res.status(500).json(e)
    }
})

//Delete
router.delete("/:id", verifyTokenAndAdmin, async(req, res)=>{
    try{
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json('Product has been deleted')
    }catch(e){
        res.status(500).json(e)
    }
})

//Get product
router.get("/find/:id", async(req, res)=>{
    try{
        const product = await Product.findById(req.params.id)
        res.status(200).json(product)
    }catch(e){
        res.status(500).json(e)
    }
})

//Search product
router.get("/search", async(req, res)=>{
    const qKeyword = (req.query.keyword)
    try{
        const products = await Product.find({ $text: { $search: qKeyword } })
        res.status(200).json(products)
    }catch(e){
        res.status(500).json(e)
    }
})

//GET ALL PRODUCT
router.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
        var products;
        if(qNew){
            products = await Product.find().sort({createdAt: -1}).limit(5)
        } else if(qCategory) {
            products = await Product.find({categories: {
                $in: [qCategory],
            }})
        } else{
            products = await Product.find()
        }
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router