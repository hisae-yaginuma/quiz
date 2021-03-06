// This is a JavaScript file
var app = angular.module('myApp',['onsen']);

app.controller('topCtrl',function(){
    this.gameStart = function(){
        myNavigator.pushPage('game.html');
    }
    this.changeTheme = function(theme) {
      var page = document.getElementById("bgTheme")
      page.className = theme;
    }
});

app.controller('gameCtrl',function(questionsService,$scope){
    var me = this;//thisをmeに退避
    me.items = {};
    var rightNum = 0;//正解数
    var anserNum = null;//正解番号
    var questions = null;//クイズデータ

    var init = function(){
        me.items.currentNum = 0;//現在のクイズ番号(1問目)
        questions = JSON.parse(JSON.stringify(questionsService.questions));//クイズデータをサービスより取得&ディープコピー
        me.items.totalNum = questions.length;//取得したクイズデータの全クイズ数
        questionInit();
    }

    //解答選択肢用意
    var questionInit = function(){
        var currentQ = questions[me.items.currentNum];//現在のクイズ
    	var qLength = currentQ.choices.length;//答え以外の選択肢数
        answerNum = Math.floor(Math.random() * (qLength + 1));//答えの番号(ランダム)
        currentQ.choices.splice(answerNum , 0 , currentQ.answer);//選択肢に答えを混ぜる
        me.items.currentQ = currentQ;//現在のクイズをデータバインド用オブジェクトに代入
    };

    //解答ボタンが押されたら
    me.getAnswer = function(ind){
    	var flag = answerNum == ind;//正解か間違いか判定
    	var flagText = "間違い";
    	if(flag){//正解だったら
    		rightNum++;//正解数を増やす
    		flagText = "正解";
    	}
    	ons.notification.alert({//解答をアラート表示
			  message: '正解は『' + me.items.currentQ.choices[answerNum] + '』です',
			  title: flagText,
			  buttonLabel: 'NEXT',
			  animation: 'default',
			  callback: function() {// NEXTがクリックされたら
			    if(me.items.currentNum >= me.items.totalNum-1){//全問終了したら
			    	myNavigator.pushPage('result.html',{totalNum:me.items.totalNum,rightNum:rightNum});
			    }else{//まだクイズが残っていれば
			    	me.items.currentNum++;
			    	$scope.$apply(questionInit);//次のクイズ用意
			    }
			  }
		});
    };

    //closeボタンがクリックされたらトップページへ戻る
    me.backTop = function(){
        myNavigator.pushPage('top.html', { animation: "fade" });
    };
    init();
});

app.controller('resultCtrl',function(){
    var rate = 100;
    this.items = myNavigator.getCurrentPage().options;
    this.items.score = this.items.rightNum * rate;
    this.backTop = function(){
    		myNavigator.pushPage('top.html', { animation: "none" });
    };
});
