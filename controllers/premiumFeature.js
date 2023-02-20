const Expense=require('../models/expense');
const User=require('../models/user');

const sequelize=require('../util/database');

const getLeaderUserBoard=async(req,res)=>{
try{
   const leaderBoardofusers=await User.findAll({
    attributes:['id','name','totalexpense'],
   order:[[sequelize.col('totalexpense'),"DESC"]]  
});
   
   res.status(200).json(leaderBoardofusers);

}catch(err){
    console.log(err);
    res.status(500).json(err);
}
}






module.exports={
    getLeaderUserBoard
}