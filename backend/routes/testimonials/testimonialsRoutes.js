const express = require('express')
const testimonialsController = require('../../Controller/testimonials/testimonialsController')

const router = express.Router()


router.post('/add', testimonialsController.addTestiMonials)
router.get('/', testimonialsController.allTestiMonials)
router.delete('/del/:id' , testimonialsController.deleteTestimonial)
router.get('/spe/:id' , testimonialsController.getSingleTestimonial)
router.put('/edit/:id' , testimonialsController.updateTestimonial)


module.exports = router