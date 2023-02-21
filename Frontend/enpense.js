const myForm=document.querySelector('#my-form');
const expenseInput = document.querySelector('#price');
const descriptionInput = document.querySelector('#description');
const categoryInput = document.querySelector('#category');
const showLeaderboard=document.createElement('button');
const downloadexpense=document.createElement('button');
downloadexpense.className='btn1 btn-danger btn-sm  ';
const header1 = document.querySelector('.head');
      downloadexpense.appendChild(document.createTextNode('downloadexpense'));
      header1.appendChild(downloadexpense);  
    downloadexpense.disabled=true;
myForm.addEventListener('submit', onSubmit);

const perpage=document.querySelector('#perpage');
perpage.addEventListener('submit', onSub);

function onSub(e){
  e.preventDefault();
  const Items_Per_Page=e.target.Items_Per_Page.value;
  localStorage.setItem('Items_Per_Page',Items_Per_Page);
  
}

function onSubmit(e) {
  e.preventDefault();
  
  const price=e.target.price.value;
  const description=e.target.description.value;
  const category=e.target.category.value;
  const token= localStorage.getItem('token');

    const myobj={
       price,description,category
    }
    
    axios.post("http://18.183.25.92:3000/expense/add-expense",myobj,{ headers: {"Authorization":token} })
    .then((res)=>{
        console.log(res);
        showExpense(res.data.expenseDetails);
    }).catch((err)=>{
     console.log(err);
    })
    expenseInput.value = '';
    descriptionInput.value = '';
    categoryInput.value=1;
    
}

window.addEventListener("DOMContentLoaded",()=>{
    const token=localStorage.getItem('token');
    let page = 1;
    const Items_Per_Page=localStorage.getItem('Items_Per_Page');
    axios.get(`http://18.183.25.92:3000/expense/get-expenses/${page}/${Items_Per_Page}`,{ headers: {"Authorization":token} })
    .then((res)=>{
     
      for(var i=0;i<res.data.data.length;i++){
        showExpense(res.data.data[i]);
      }
      showPagination(res.data.info);
    }).catch((err)=>{
      console.log(err);
    })
   })

   function showPagination({currentPage,hasNextPage,hasPreviousPage,nextPage,previousPage,lastPage}){
    let page = 1;
    const pagination = document.getElementById('pagination')

    pagination.innerHTML = '';

    if(hasPreviousPage){
        const button1 = document.createElement('button');
        button1.className='btn btn-danger btn-sm  delete';
        button1.innerHTML = previousPage ;
        button1.addEventListener('click' , ()=>getPageExpenses(previousPage))
        pagination.appendChild(button1)
    }

    const button2 = document.createElement('button');
    button2.className='btn btn-danger btn-sm  delete';
    button2.classList.add('active')
    button2.innerHTML = currentPage ;
    button2.addEventListener('click' , ()=>getPageExpenses(currentPage))
    pagination.appendChild(button2)

    if(hasNextPage){
        const button3 = document.createElement('button');
        button3.className='btn btn-danger btn-sm  delete';
        button3.innerHTML = nextPage ;
        button3.addEventListener('click' , ()=>getPageExpenses(nextPage))
        pagination.appendChild(button3)
    }

    if( currentPage!=lastPage && nextPage!=lastPage && lastPage != 0){
        const button3 = document.createElement('button');
        button3.className='btn btn-danger btn-sm  delete';
        button3.innerHTML = lastPage ;
        
        button3.addEventListener('click' , ()=>getPageExpenses(lastPage))
        pagination.appendChild(button3)
    }
}

async function getPageExpenses(page){


  const token = localStorage.getItem('token')
  const userList = document.querySelector('#users');
  const Items_Per_Page=localStorage.getItem('Items_Per_Page');
  let response = await axios.get(`http://18.183.25.92:3000/expense/get-expenses/${page}/${Items_Per_Page}`,{headers: { "Authorization": token}} )
  

  console.log(response.data.info);
  if(response.status === 200){
    userList.innerHTML=''
      for(let i=0;i<response.data.data.length;i++){
          showExpense(response.data.data[i]);
      }

  }

  showPagination(response.data.info)
}


function showExpense(myobj){
    const userList = document.querySelector('#users');
   
    const li = document.createElement('li');

    // Add text node with input values
    li.appendChild(document.createTextNode(`${myobj.price} - ${myobj.description}-${myobj.category}`));
    userList.appendChild(li);
    var deleteBtn=document.createElement('button');
    deleteBtn.className='btn btn-danger btn-sm  delete';
    deleteBtn.appendChild(document.createTextNode('delete'));
    li.appendChild(deleteBtn);

    var editBtn=document.createElement('button');
editBtn.className='btn btn-primary btn-sm  edit';
editBtn.appendChild(document.createTextNode('edit'));
    li.appendChild(editBtn);
    deleteBtn.onclick=()=>{
        userList.removeChild(li);
        const token=localStorage.getItem('token');
        axios.delete(`http://18.183.25.92:3000/expense/delete-expense/${myobj.id}`,{ headers: {"Authorization":token} });
    } 
    editBtn.onclick=()=>{ 
        axios.delete(`http://18.183.25.92:3000/expense/delete-expense/${myobj.id}`,{ headers: {"Authorization":token} });
        userList.removeChild(li);
        expenseInput.value = myobj.price;
    descriptionInput.value = myobj.description;
    categoryInput.value=myobj.category;
    } 
    expenseInput.value = '';
    descriptionInput.value = '';
    categoryInput.value=1;
}

document.getElementById('rzp-button1').onclick=async function(e){
const token=localStorage.getItem('token');
const response=await axios.get('http://18.183.25.92:3000/purchase/premiummembership',{headers:{"Authorization":token}});
console.log(response);
var options={
"key":response.data.key_id,
"order_id":response.data.order.id,
"handler":async function(response){
  await axios.post('http://18.183.25.92:3000/purchase/updatetransactionstatus',{
order_id:options.order_id,
payment_id:response.razorpay_payment_id,
status1:true
  },
  {headers:{"Authorization":token}})
  if(response.data.ispremiumuser){
    const header1 = document.querySelector('.head');
    const h1 = document.createElement('h1');
    h1.appendChild(document.createTextNode('You are a Premium User'));
    header1.appendChild(h1);
  const premiumButton=  document.getElementById('rzp-button1');
  premiumButton.style.display = 'none';
  showLeaderboard.className='btn btn-danger btn-sm  delete';
  showLeaderboard.appendChild(document.createTextNode('showLeaderbord'));
  header1.appendChild(showLeaderboard); 
  downloadexpense.disabled=false;
}
  alert('You are premium user now')
  
}
};
const rzp1=new Razorpay(options);
rzp1.open();
e.preventDefault();

rzp1.on('payment.failed',async function(response){
  await axios.post('http://18.183.25.92:3000/purchase/updatetransactionstatus',{
    order_id:options.order_id,
    status1:false
      },
      {headers:{"Authorization":token}})
alert('Something went wrong');
})
}

window.addEventListener("DOMContentLoaded",()=>{
  const sendGetRequest = async () => {
    try {
      const token=localStorage.getItem('token');
      const response=await axios.get('http://18.183.25.92:3000/purchase/premiummembership',{headers:{"Authorization":token}});
      console.log(response);
      if(response.data.ispremiumuser){
        const header1 = document.querySelector('.head');
        const h1 = document.createElement('h1');
        h1.appendChild(document.createTextNode('You are a Premium User'));
        header1.appendChild(h1);
      const premiumButton=  document.getElementById('rzp-button1');
      premiumButton.style.display = 'none';
      showLeaderboard.className='btn1 btn-danger btn-sm  ';
      showLeaderboard.appendChild(document.createTextNode('showLeaderbord'));
      header1.appendChild(showLeaderboard);  
      downloadexpense.disabled=false;
    }
    } catch (err) {
        // Handle Error Here
        console.error(err);
    }
};

sendGetRequest();
      });

     showLeaderboard.onclick=async()=>{
      const token=localStorage.getItem('token');
      const userLeaderBoardArray=await axios.get('http://18.183.25.92:3000/premium/showLeaderBoard',{headers:{"Authorization":token}});
      
      var leaderboardElement=document.getElementById('leaderboard');
      
      
      userLeaderBoardArray.data.forEach((userDetails)=>{
        const li = document.createElement('li');
        li.appendChild(document.createTextNode(`Name- ${userDetails.name} Total Expense- ${userDetails.totalexpense}`));
        leaderboardElement.appendChild(li);
      })
     } 

     downloadexpense.onclick=async()=>{
      const userType = localStorage.getItem('user')
      
          window.location.href = './report.html'
    
  }