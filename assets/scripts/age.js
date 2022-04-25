var dob = new Date(2001, 8, 17);
var diff_ms = Date.now() - dob.getTime();
var age_dt = new Date(diff_ms);

var age = Math.abs(age_dt.getUTCFullYear() - 1970);

document.getElementById("myAge").innerText = "age: " + age + ",";
