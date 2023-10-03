const Payments = require('../models/paymentModel');
const Users = require('../models/userModel');
const Products = require('../models/productModel');
const winston = require('winston');


const logger = winston.createLogger({
  level: 'info', 
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(), 
    new winston.transports.File({ filename: 'error.log', level: 'error' }), 
    new winston.transports.File({ filename: 'combined.log' }) 
  ]
});

const paymentCtrl = {
    getPayments: async(req, res) =>{
        try {
            const payments = await Payments.find();
            console.log('Payments:', payments); 
            res.json(payments);
        } catch (err) {
            logger.error(`Error in getPayments: ${err.message}`);
            console.error('Error:', err); 
            return res.status(500).json({msg: err.message});
        }
    },
    createPayment: async(req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('name email');
            console.log('User:', user); 
            if(!user) {
                logger.error("User does not exist.");
                console.error("User does not exist."); 
                return res.status(400).json({msg: "User does not exist."});
            }

            const {cart, paymentID, address} = req.body;

            const {_id, name, email} = user;

            const newPayment = new Payments({
                user_id: _id, name, email, cart, paymentID, address
            });

            cart.filter(item => {
                return sold(item._id, item.quantity, item.sold);
            });

            await newPayment.save();
            res.json({msg: "Payment Success!"});
            logger.info("Payment Success!");
            
        } catch (err) {
            logger.error(`Error in createPayment: ${err.message}`);
            console.error('Error:', err); 
            return res.status(500).json({msg: err.message});
        }
    }
};

const sold = async (id, quantity, oldSold) =>{
    await Products.findOneAndUpdate({_id: id}, {
        sold: quantity + oldSold
    });
};

module.exports = paymentCtrl;
