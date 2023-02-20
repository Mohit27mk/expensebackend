const Expense=require('../models/expense');
const User=require('../models/user');
const sequelize=require('../util/database');
const AWS=require('aws-sdk');
const Userservices=require('../services/userservices');
const S3services=require('../services/s3services');



exports.downloadexpense=async(req,res)=>{
try{
    const expenses=await Userservices.getExpenses(req);
    console.log(expenses);
    const stringifiedExpense=JSON.stringify(expenses);
    
    const userId=req.user.id;
    const filename=`Expense${userId}/${new Date()}.txt`;
    const fileURL=await S3services.uploadToS3(stringifiedExpense,filename);
    const downloadUrlData = await req.user.createDownloadUrl({
        fileURL: fileURL,
        filename
    })
    res.status(200).json({fileURL,downloadUrlData,success:true});
}catch(err){
    console.log(err);
res.status(500).json({fileURL:'',success:false,err:err});
}  
}

exports.downloadAllUrl = async(req,res,next) => {
    try {
        let urls = await req.user.getDownloadUrls();
        if(!urls){
            res.sttus(404).json({ message: 'no urls found'})
        }
        res.status(200).json({ urls, success: true})
    } catch (error) {
        console.log(err);
        res.status(500).json({error})
    }
}

exports.postAddExpense=async(req,res,next)=>{
    const t=await sequelize.transaction();
    try{
   const price=req.body.price;
   const description=req.body.description;
   const category=req.body.category;
   const userId=req.user.id;

   if(price==undefined||price.length==0){
    return res.status(400).json({success:false,message:"parameters Missing"})
   }

   const user=await User.findOne({where:{id:userId}});
   var totalexpense=user.totalexpense;
   totalexpense=Number(totalexpense)+Number(price);   
   
   const data=await Expense.create({price:price,description:description,category:category,userId:userId},{transaction:t})
   await user.update({totalexpense:totalexpense},{transaction:t})
    await t.commit();
   res.status(201).json({expenseDetails:data});   
}catch (err){
    await t.rollback();
        console.log(err);
    }
}

exports.getExpenses=async(req,res,next)=>{
    try{
        let page = req.params.page || 1;
    let Items_Per_Page = +(req.params.Items_Per_Page);
    console.log(page);
    console.log(Items_Per_Page);
    let totalItems;
    let count = await Expense.count({where: {userId:req.user.id}})
    totalItems = count;

    const data = await req.user.getExpenses({offset: (page-1)*Items_Per_Page,limit: Items_Per_Page})

    res.status(200).json({
        data,
        info: {
            currentPage: page,
            hasNextPage: totalItems > page * Items_Per_Page,
            hasPreviousPage: page > 1,
            nextPage: +page + 1,
            previousPage: +page - 1,
            lastPage: Math.ceil(totalItems / Items_Per_Page) 
        }
    });
    // const expenses=await Expense.findAll({where:{userId:req.user.id}});
    // res.status(200).json({allExpense:expenses});
    }catch(err){
        console.log(err);
        res.status(500).json({err:err});
    }
   }
   
   exports.deleteExpense=async(req,res,next)=>{
    const t=await sequelize.transaction();

      try{
        const uId=req.params.id;
        const userId=req.user.id;
        const expense=await Expense.findOne({where:{id:uId}});
         const price=expense.price;
        const user=await User.findOne({where:{id:userId}});
        var totalexpense=user.totalexpense;
        totalexpense=Number(totalexpense)-Number(price);   
       await Expense.destroy({where:{id:uId,userId:userId}},{transaction:t});
       await user.update({totalexpense:totalexpense},{transaction:t})
    await t.commit();   
       res.sendStatus(200);
    }
       catch(err){
        await t.rollback();
           console.log(err);
       }
   }



