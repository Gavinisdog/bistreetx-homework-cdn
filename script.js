const app = new Vue({
    el: "#App",
    data: {
        popup: false, // 是否顯示popup window
        countdown: "剩餘時間計算中", // 倒數計時
        premiumIndex: [] // API資料
    }, methods: {
        renderData() {
            // 使用Axios.js獲取API資料
            axios.get('https://testnet.binancefuture.com/dapi/v1/premiumIndex')
                .then(res => {
                    this.premiumIndex = res.data;
                    this.premiumIndex.forEach(ele => {
                        ele.pair = ele.pair.replace("USD", " / USD")
                        if (ele.nextFundingTime == 0) {
                            ele.fundingTime = "已截止";
                        } else {
                            ele.fundingTime = new Date(ele.nextFundingTime).toLocaleString();
                        }
                    })
                })
                .catch(err => {
                    console.log("[API error]", err);
                });
        }
    },
    created: function () {
        // 設定截止時間為2023-02-28
        const deadline = new Date('2023-02-28');
        // 設定計時器
        const countdownInterval = setInterval(() => {
            // 計算與現在時間的時間差
            const now = new Date().getTime(),
                timeDiff = deadline - now;
            // 如果時間差小於等於0，則清除計時器
            if (timeDiff <= 0) {
                clearInterval(countdownInterval);
                this.countdown = '已截止';
            } else {
                // 計算剩餘時間的天數、小時、分鐘和秒數
                const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24)),
                    hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
                // 格式化剩餘時間
                this.countdown = days + '天 ' + hours + '小時 ' + minutes + '分鐘 ' + seconds + '秒';
            }
        }, 1000);
        this.renderData();
    }
});