const express=require('express');
const bodyParser = require('body-parser');
// const helmet=require('helmet');
// const morgan=require('morgan');
const fs=require('fs');
const path=require('path');
require('dotenv').config();

const sequelize=require('./util/database');

var cors=require('cors');
const app=express();

const accessLogStream=fs.createWriteStream(path.join(__dirname,'access.log'),
{flag:'a'}
);

app.use(cors());
// app.use(helmet());
// app.use(morgan('combined',{stream:accessLogStream}));

const Expense=require('./models/expense');
const User=require('./models/user');
const ForgotPassword = require('./models/forgotpassword');
const DownloadUrl = require('./models/downloadUrl');


const userRoutes=require('./routes/user');
const expenseRoutes=require('./routes/expense');
const purchaseRoutes=require('./routes/purchase');
const premiumFeatureRoutes=require('./routes/premiumFeature');
const passwordRoutes=require('./routes/password');

const Order = require('./models/orders');

// app.use(bodyParser.json({ extended: false }));

app.use('/user',userRoutes);
app.use('/expense',expenseRoutes);
app.use('/purchase',purchaseRoutes);
app.use('/premium',premiumFeatureRoutes);
app.use('/password',passwordRoutes);
app.use((req,res)=>{
    res.sendFile(path.join(__dirname,`Frontend/${req.url}`));
})

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(ForgotPassword);
ForgotPassword.belongsTo(User);

User.hasMany(DownloadUrl)
DownloadUrl.belongsTo(User)



sequelize.sync()
.then(result=>{
    app.listen(process.env.PORT);
}).catch(err=>{
    console.log(err);
});

