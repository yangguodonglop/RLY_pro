//将时间格式化
export default {
    getTimes: function(b) {
    let e = new Date(b)
    let year = e.getFullYear();
    let month = e.getMonth() + 1;
    let day = e.getDate();
    let hh =
        e.getHours() < 10 ?
        "0" + e.getHours() :
        e.getHours();
    let mm =
        e.getMinutes() < 10 ?
        "0" + e.getMinutes() :
        e.getMinutes();
    let ss =
        e.getSeconds() < 10 ?
        "0" + e.getSeconds() :
        e.getSeconds();
    let endTime = `${year}-${month}-${day} ${hh}:${mm}:${ss}`;
    return endTime
},
 SecondToDate:function(msd) {
    var time =msd
    if (null != time && "" != time) {
        if (time > 60 && time < 60 * 60) {
            time = parseInt(time / 60.0) + "分钟" + parseInt((parseFloat(time / 60.0) -
                parseInt(time / 60.0)) * 60) + "秒";
        }
        else if (time >= 60 * 60 && time < 60 * 60 * 24) {
            time = parseInt(time / 3600.0) + "小时" + parseInt((parseFloat(time / 3600.0) -
                parseInt(time / 3600.0)) * 60) + "分钟" +
                parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
                parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + "秒";
        } else if (time >= 60 * 60 * 24) {
            time = parseInt(time / 3600.0/24) + "天" +parseInt((parseFloat(time / 3600.0/24)-
                parseInt(time / 3600.0/24))*24) + "小时" + parseInt((parseFloat(time / 3600.0) -
                parseInt(time / 3600.0)) * 60) + "分钟" +
                parseInt((parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
                parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) * 60) + "秒";
        }
        else {
            time = parseInt(time) + "秒";
        }
    }
    return time;
},
}