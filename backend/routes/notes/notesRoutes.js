const express = require("express");
const noteController = require('../../Controller/notes/notesController')


const router = express.Router();

router.post('/addnote' ,noteController.addNote )
router.get('/allnotes' ,noteController.getNotes )
router.get('/spenote/:id' , noteController.getNoteById)
router.put(`/editnote/:id` , noteController.updateNote)
router.delete('/delnote/:id' , noteController.permanentDeleteNote)
router.patch('/softdelnote/:id' , noteController.softDeleteNote)
router.patch('/restorenote/:id' , noteController.restoreNote)
router.patch('/toggleimp/:id' , noteController.toggleImportantNote)


module.exports = router
