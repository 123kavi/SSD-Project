const Category = require('../models/categoryModel');
const Products = require('../models/productModel');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

const categoryCtrl = {
  getCategories: async (req, res) => {
    try {
      const categories = await Category.find();
      console.log('Categories:', categories); 
      res.json(categories);
    } catch (err) {
      logger.error(`Error in getCategories: ${err.message}`);
      console.error('Error:', err); 
      return res.status(500).json({ msg: 'Internal server error' });
    }
  },
  createCategory: async (req, res) => {
    try {
      const { name } = req.body;
      const category = await Category.findOne({ name });
      console.log('Category:', category); // Add this line
      if (category) {
        logger.warn(`Category '${name}' already exists.`);
        console.error(`Category '${name}' already exists.`);
        return res.status(400).json({ msg: 'This category already exists.' });
      }

      const newCategory = new Category({ name });
      await newCategory.save();
      logger.info(`Created a new category: '${name}'`);
      console.log(`Created a new category: '${name}'`); 
      res.json({ msg: 'Created a category' });
    } catch (err) {
      logger.error(`Error in createCategory: ${err.message}`);
      console.error('Error:', err); 
      return res.status(500).json({ msg: 'Internal server error' });
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const products = await Products.findOne({ category: req.params.id });
      console.log('Products:', products); 
      if (products) {
        logger.warn('Cannot delete category as it has associated products.');
        console.error('Cannot delete category as it has associated products.'); 
        return res.status(400).json({
          msg: 'Please delete all products with a relationship.',
        });
      }

      await Category.findByIdAndDelete(req.params.id);
      logger.info(`Deleted category with ID: ${req.params.id}`);
      console.log(`Deleted category with ID: ${req.params.id}`); 
      res.json({ msg: 'Deleted a Category' });
    } catch (err) {
      logger.error(`Error in deleteCategory: ${err.message}`);
      console.error('Error:', err); 
      return res.status(500).json({ msg: 'Internal server error' });
    }
  },
  updateCategory: async (req, res) => {
    try {
      const { name } = req.body;
      await Category.findOneAndUpdate({ _id: req.params.id }, { name });
      logger.info(`Updated category with ID: ${req.params.id}`);
      console.log(`Updated category with ID: ${req.params.id}`); 
      res.json({ msg: 'Updated a category' });
    } catch (err) {
      logger.error(`Error in updateCategory: ${err.message}`);
      console.error('Error:', err); 
      return res.status(500).json({ msg: 'Internal server error' });
    }
  },
};

module.exports = categoryCtrl;
