
const express = require('express');

const expenseController = require('../controllers/expense');
const userauthentication=require('../middleware/auth')
;
const router = express.Router();

router.post('/add-expense',userauthentication.authenticate,expenseController.postAddExpense);

router.get('/getAllUrl',userauthentication.authenticate,expenseController.downloadAllUrl);

router.get('/download',userauthentication.authenticate,expenseController.downloadexpense);


router.get('/get-expenses/:page/:Items_Per_Page',userauthentication.authenticate,expenseController.getExpenses);

router.delete('/delete-expense/:id',userauthentication.authenticate,expenseController.deleteExpense);





module.exports = router;
