function getYearsWithData(year, month, day) {
    let date = new Date(year, month, day);
    let diff_ms = Date.now() - date.getTime();
    let year_dt = new Date(diff_ms);
    let years = Math.abs(year_dt.getUTCFullYear() - 1970);
    if (years < 1) {
        return "~1"
    } else {
        return "+" + years
    }
}

document.getElementById("javaYears").innerText = "Java / " + getYearsWithData(2021, 1, 12);
document.getElementById("pythonYears").innerText = "Python / " + getYearsWithData(2016, 7, 1);
document.getElementById("htmlYears").innerText = "HTML / " + getYearsWithData(2020, 1, 1);
document.getElementById("cssYears").innerText = "CSS / " + getYearsWithData(2020, 1, 12);
document.getElementById("javascriptYears").innerText = "JavaScript / " + getYearsWithData(2021, 4, 1);
document.getElementById("netYears").innerText = ".NET / " + getYearsWithData(2022, 3, 1);
document.getElementById("csharpYears").innerText = "C# / " + getYearsWithData(2022, 3, 1);
document.getElementById("sqlYears").innerText = "SQL / " + getYearsWithData(2017, 7, 1);
document.getElementById("postgresqlYears").innerText = "Postgresql / " + getYearsWithData(2020, 8, 1);
document.getElementById("springBootYears").innerText = "Spring Boot / " + getYearsWithData(2021, 6, 13);
document.getElementById("nodeYears").innerText = "Node.js / " + getYearsWithData(2021, 4, 1);
document.getElementById("hibernateYears").innerText = "Hibernate / " + getYearsWithData(2021, 8, 1);
document.getElementById("npmYears").innerText = "NPM / " + getYearsWithData(2021, 4, 1);
document.getElementById("litYears").innerText = "Lit Element / " + getYearsWithData(2021, 10, 20);
document.getElementById("junitYear").innerText = "Junit Testing / " + getYearsWithData(2021, 3, 10);
document.getElementById("githubYears").innerText = "GitHub / " + getYearsWithData(2022, 9, 24);
document.getElementById("herokuYears").innerText = "Heroku / " + getYearsWithData(2021, 1, 12);
document.getElementById("postmanYears").innerText = "Postman / " + getYearsWithData(2021, 3, 12);
document.getElementById("umlYears").innerText = "UML / " + getYearsWithData(2021, 1, 12);;
document.getElementById("vpYears").innerText = "Visual Paradigm / " + getYearsWithData(2021, 1, 12);
