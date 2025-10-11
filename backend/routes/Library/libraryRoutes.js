const express = require('express')
const upload = require('../../multer/multer')
const libraryController = require('../../Controller/library/libraryController')



const router = express.Router()

router.post('/addlibrarymember' , upload.single('limember') ,libraryController.addLibraryMember )
router.get('/' , libraryController.allLibraryMember)



// book routes
router.post('/addbook' ,upload.single('bookimg'), libraryController.addBook)
router.get('/allbook' , libraryController.getAllBooks)


// issue book
router.get('/studataforissuebook' , libraryController.stuDataForIssueBook)
router.get('/bookdataforissuebook' , libraryController.bookDataForIssueBook)
router.post('/issuebook' , libraryController.issueBook)
router.get('/stuissuebookdata/:rollnum' , libraryController.getSpeStuIssueBookData)
router.get('/getallstuissuebook' , libraryController.getAllStuIssueBook)

// return book
router.get('/spestunotretubookdata/:rollnum' , libraryController.bookTakenByStuAndNotReturn)
router.put('/returnbook' , libraryController.returnBook)









module.exports = router