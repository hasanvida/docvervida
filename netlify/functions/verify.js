const { randomUUID } = require("crypto")

exports.handler = async (event) => {

try{

const body = JSON.parse(event.body)
const image = body.image

const partnerTrxId = randomUUID()
const groupId = randomUUID()
const epoch = Math.floor(Date.now()/1000)


// GET TOKEN

const tokenRes = await fetch(
"https://qa-sso.vida.id/auth/realms/vida/protocol/openid-connect/token",
{
method:"POST",
headers:{
"Content-Type":"application/x-www-form-urlencoded"
},
body:new URLSearchParams({
grant_type:"client_credentials",
client_id:process.env.VIDA_CLIENT_ID,
client_secret:process.env.VIDA_CLIENT_SECRET
})
}
)

const tokenData = await tokenRes.json()
const accessToken = tokenData.access_token


// CALL VERIFY API

const verifyRes = await fetch(
"https://my-services-sandbox.np.vida.id/api/v2/verify",
{
method:"POST",
headers:{
Authorization:`Bearer ${accessToken}`,
"Content-Type":"application/json"
},
body:JSON.stringify({

operations:["ocr","idVerification"],

payload:{
partnerTrxId,
groupId,
idType:"ID_CARD",
country:"MYS",
idSubtype:"MyKad",
idFrontSideImage:image
},

userConsent:{
userIP:"0.0.0.0",
country:"IDN",
obtained:true,
obtainedAt:epoch
}

})
}
)

const verifyData = await verifyRes.json()

return{
statusCode:200,
body:JSON.stringify(verifyData)
}

}catch(err){

return{
statusCode:500,
body:JSON.stringify({error:err.message})
}

}

}
