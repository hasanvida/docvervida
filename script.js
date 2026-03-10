const fileInput = document.getElementById("fileInput")
const preview = document.getElementById("preview")
const resultBox = document.getElementById("result")
const verifyBtn = document.getElementById("verifyBtn")

fileInput.addEventListener("change", () => {

const file = fileInput.files[0]

if(!file) return

const reader = new FileReader()

reader.onload = () => {
preview.src = reader.result
}

reader.readAsDataURL(file)

})


verifyBtn.addEventListener("click", async () => {

const file = fileInput.files[0]

if(!file){
alert("Upload ID first")
return
}

const base64 = await toBase64(file)
const image = base64.split(",")[1]

resultBox.textContent = "Processing..."

const res = await fetch("/api/verify",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({image})
})

const data = await res.json()

resultBox.textContent =
JSON.stringify(data,null,2)

})


function toBase64(file){

return new Promise((resolve,reject)=>{

const reader = new FileReader()

reader.readAsDataURL(file)

reader.onload = () => resolve(reader.result)

reader.onerror = error => reject(error)

})

}
