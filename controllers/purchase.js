const Razorpay=require('razorpay');
const Order=require('../models/orders');




const purchasepremium=async(req,res,next)=>{
try{
var rzp=new Razorpay({
    key_id:process.env.KEY_ID,
    key_secret:process.env.KEY_SECRET

})
const amount =2500;

rzp.orders.create({amount,currency:"INR"},(err,order)=>{
if(err){
    console.log(err);
    throw new Error(JSON.stringify(err));
}
req.user.createOrder({orderid:order.id,status:'PENDING'})
.then(()=>{
    return res.status(201).json({order,key_id:rzp.key_id,ispremiumuser:req.user.ispremiumuser});
}).catch(err=>{
    throw new Error(err)
})
})
}catch(err){
   console.log(err);
   res.status(403).json({message:'Something went wrong',error:err}) ;
}
}

const updatetransactionStatus=async(req,res)=>{
try{
const{payment_id,order_id,status1}=req.body;

const order=await Order.findOne({where:{orderid:order_id}})

if(!status1){
    return await order.update({status:"Failed"});
}
const Promise1=order.update({paymentid:payment_id,status:"SUCCESSFUL"})

 const Promise2= req.user.update({ispremiumuser:true})
 
 Promise.all([Promise1,Promise2]).then(()=>{
    return res.status(201).json({success:true,message:"Transaction Successful"});
 }).catch((err)=>{
    throw new Error(err);
 })
}catch(err){
res.status(403).json({error:err,message:"Something went wrong"})
}
}

module.exports={
    purchasepremium,
    updatetransactionStatus
}
