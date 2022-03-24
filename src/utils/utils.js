export  function getTime(time) {
    let d = new Date(time);
    let year = d.getFullYear()
    let month = (d.getMonth() + 1)< 10 ? "0" + (d.getMonth() + 1) : d.getMonth
    let date = d.getDate() < 10 ? "0" + d.getDate() : d.getDate()
    let hours = d.getHours()< 10 ? "0" + d.getHours() : d.getHours()
    let minutes = d.getMinutes()< 10 ? "0" + d.getMinutes() : d.getMinutes()
    let seconds = d.getSeconds()< 10 ? "0" + d.getSeconds() : d.getSeconds()
    return year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds
}
export default {
    getTime
}
