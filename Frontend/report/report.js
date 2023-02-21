const token = localStorage.getItem('token');
const listurl = document.getElementById('listurl-div');

const download  = document.getElementById('download');
var listno=0;

window.addEventListener('DOMContentLoaded',async (event) => {
    event.preventDefault();

    try {
        const res = await axios.get('http://18.183.25.92:3000/expense/getAllUrl',{headers: {'Authorization' : token}})

        if(res.status === 200){
            console.log(res)
             showUrls(res.data)
        }
    } catch (error) {
        console.log(error)
    }
})

function showUrls(data){
    listurl.innerHTML = ''

    data.urls.forEach(url => {
        let child = `<li class="list" >
        <a href="${url.fileURL}" class="expense-info">${listno + 1}. ${url.filename.split('/')[1]}</a>
        </li>`
        
       

        listurl.innerHTML += child;

        listno++
    })
}

 document.getElementById('download').onclick=async()=>{
    try {
        const res = await axios.get('http://18.183.25.92:3000/expense/download',{headers: {'Authorization' : token}})

        if(res.status === 200){
            var a=document.createElement("a");
            a.href=res.data.fileURL;
            a.download='myexpense.csv';
            a.click();
        }
    } catch (error) {
        console.log(error)
    }
 }
    
