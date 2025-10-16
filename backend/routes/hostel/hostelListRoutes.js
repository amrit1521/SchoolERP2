const router = require('express').Router()
const hostelController = require('../../Controller/hostel/hostelListController')


router.post('/addhostel' , hostelController.addHostel)
router.get('/gethostels' , hostelController.getHostels)
router.get('/gethostelbyid/:id' , hostelController.getHostelById)
router.put('/edithostel/:id' , hostelController.updateHostel)
router.delete('/deletehostel/:id' , hostelController.deleteHostel)
router.get('/hostelforoption' , hostelController.hostelForOption)


// room type
router.post("/addroomtype", hostelController.addHostelRoomType);
router.get("/allroomtype", hostelController.getHostelRoomTypes);
router.get("/speroomtype/:id", hostelController.getHostelRoomTypeById);
router.put("/editroomtype/:id", hostelController.updateHostelRoomType);
router.delete("/deleteroomtype/:id", hostelController.deleteHostelRoomType);
router.get('/hostelroomtypeforoption' , hostelController.hostelRoomTypeForOption)

module.exports = router;


module.exports = router