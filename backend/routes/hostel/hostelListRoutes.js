const router = require('express').Router()
const hostelController = require('../../Controller/hostel/hostelListController')


router.post('/addhostel', hostelController.addHostel)
router.get('/gethostels', hostelController.getHostels)
router.get('/gethostelbyid/:id', hostelController.getHostelById)
router.put('/edithostel/:id', hostelController.updateHostel)
router.delete('/deletehostel/:id', hostelController.deleteHostel)
router.get('/hostelforoption', hostelController.hostelForOption)


// room type
router.post("/addroomtype", hostelController.addHostelRoomType);
router.get("/allroomtype", hostelController.getHostelRoomTypes);
router.get("/speroomtype/:id", hostelController.getHostelRoomTypeById);
router.put("/editroomtype/:id", hostelController.updateHostelRoomType);
router.delete("/deleteroomtype/:id", hostelController.deleteHostelRoomType);
router.get('/hostelroomtypeforoption', hostelController.hostelRoomTypeForOption)

// hostel room
router.post("/addhostelroom", hostelController.addHostelRoom)
router.get("/allhostelroom", hostelController.getHostelRooms)
router.delete(`/deletehostelroom/:id`, hostelController.deleteHostelRoom)
router.get(`/spehostelroom/:id`, hostelController.getHostelRoomById)
router.put('/edithostelroom/:id', hostelController.updateHostelRoom)
router.get('/getallroomforahostel/:id', hostelController.getAllRoomsForAHostel)


module.exports = router