const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const crypto = require('crypto') 
const app = express()
const fs = require('fs')

app.use(express.static('/home/dbproj/dbpage/dbvue/static'))

//create json parser
var jsonParser = bodyParser.json()

//create urlencode parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//cryption function here
function getPassword(password,salt){
// 密码“加盐”
	var saltPassword=password+':'+salt

	// 密码“加盐”的md5

	var md5=crypto.createHash("md5")

	var result=md5.update(saltPassword).digest("hex")

	return result
}



app.post('/login',urlencodedParser,function(req,res){
	console.log('Receive login post\n');
	console.log(req.body);
	 
	function validate(callback){
	fs.readFile('../passwd.json','utf-8', function(err, data) {
		// 读取文件失败/错误
		if (err) {
			throw err;
		}
		// 读取文件成功
		console.log('utf-8: ', data.toString())
		callback(data)
	})}

	validate(function(data){
		var jsonobj = JSON.parse(data.toString())

		console.log(jsonobj)
		console.log('Received Password:')
		console.log(getPassword(req.body.password,jsonobj.salt))

		if(getPassword(req.body.password,jsonobj.salt) == jsonobj.result){
			console.log('验证通过')
			res.redirect('./home.html');
			
		}
		res.end();
		})
	
});

//http.createServer(app).listen(2233,()=>console.log('Example App running on port 2233'))