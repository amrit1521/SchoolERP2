const express = require("express");
const upload = require("../../multer/multer");
const libraryController = require("../../Controller/library/libraryController");
const fileController = require("../../Controller/file/fileController");

const router = express.Router();

router.post(
  "/addlibrarymember",
  upload.single("limember"),
  libraryController.addLibraryMember
);
router.get("/", libraryController.allLibraryMember);
router.delete(
  "/deletelibrarymember/:id",
  libraryController.deleteLibraryMember
);

// book routes
router.post("/addbook", libraryController.addBook);
router.get("/allbook", libraryController.getAllBooks);
router.get("/spebook/:id", libraryController.getBookById);
router.put("/editbook/:id", libraryController.updateBook);
router.delete("/deletebook/:id", libraryController.deleteBook);

router.post("/upload", upload.single("bookImg"), fileController.uploadFile);
router.delete("/deletefile/:id", fileController.deleteFile);

// issue book
router.get("/studataforissuebook", libraryController.stuDataForIssueBook);
router.get("/techdataforissuebook", libraryController.teacherDataForIssueBook);
router.get("/bookdataforissuebook", libraryController.bookDataForIssueBook);
router.post("/issuebook", libraryController.issueBook);
router.get(
  "/stuissuebookdata/:rollnum",
  libraryController.getSpeStuIssueBookData
);
router.get("/getallstuissuebook", libraryController.getAllStuIssueBook);
router.get(
  "/getallissuebookforspecclass/:userId",
  libraryController.getAllIssueBookForSpecClass
);

// return book
router.get(
  "/spestunotretubookdata/:userId",
  libraryController.bookTakenByStuAndNotReturn
);
router.put("/returnbook", libraryController.returnBook);

// teacher
router.get('/speteacherlibrarydata/:teacherId' , libraryController.getSpeTeacherIssueBookData)

module.exports = router;
