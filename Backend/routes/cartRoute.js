import express from 'express'
import { addToCart, getUserCart, updateCart, removeFromCart, syncCart } from '../controllers/cartController.js'
import authUser from '../middleware/Auth.js'

const cartRouter = express.Router()

cartRouter.post('/get',authUser, getUserCart)
cartRouter.post('/add',authUser, addToCart)
cartRouter.post('/update',authUser, updateCart)
cartRouter.post('/remove', authUser, removeFromCart)
cartRouter.post('/sync', authUser, syncCart)

export default cartRouter