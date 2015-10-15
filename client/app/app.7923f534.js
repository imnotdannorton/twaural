"use strict";angular.module("twauralApp",["ngCookies","ngResource","ngSanitize","ngRoute","btford.socket-io"]).config(["$routeProvider","$locationProvider",function(a,b){a.otherwise({redirectTo:"/"}),b.html5Mode(!0)}]),angular.module("twauralApp").controller("MainCtrl",["$scope","$route","$location","sampleService","tweetService",function(a,b,c,d,e){a.activeTag=b.current.params.tag,a.activeTweetIndex=0,a.newTag="",a.stopAll=function(){soundManager.pauseAll(),soundManager.reboot()},a.fetchTweets=function(b){a.stopAll(),soundManager.reboot(),c.url("/"+b),a.activeTag=b;var d=e.fetchByTag(a.activeTag);d.then(function(b){a.tweetsList=b.data.statuses,a.loadTweet(a.tweetsList[0])},function(a){})},a.activeTag?a.fetchTweets(a.activeTag):a.fetchTweets("rubbertracks"),a.activeId=b.current.params.id,a.$watch("activeTweetIndex",function(b,c){console.log("updated activeTweetIndex",b,c),"undefined"!=typeof c&&a.tweetsList&&a.loadTweet(a.tweetsList[b])},!0),a.cloudfrontUrl="https://d34x6xks9kc6p2.cloudfront.net/",soundManager.setup({url:"bower_components/SoundManager2/swf/",debugMode:!1,onready:function(){console.log("sm ready!"),a.soundManagerReady=!0}}),a.loadTweet=function(b,c){if(angular.forEach(soundManager.sounds,function(a,b){console.log("killing ",a),soundManager.destroySound(a.id)}),console.log(soundManager),a.bg=b.user.profile_banner_url||b.user.profile_background_image_url||b.user.profile_image_url,a.userIcon=b.user.profile_image_url.replace("_normal",""),a.activeColor=b.user.profile_link_color,a.activeUsername=b.user.screen_name,a.activeTweet=b.text,a.origTweet=b.text,a.activeTweet=a.activeTweet.replace(/  /g," "),a.activeTweet=a.activeTweet.split(" "),a.duration=a.activeTweet.length,a.clips={},a.activeIndex=0,a.activeStrings=[],angular.forEach(a.activeTweet,function(b,c){-1==a.activeStrings.indexOf(b.toUpperCase())&&a.activeStrings.push(b.toUpperCase())}),c)var e=d.fetchLoopsByTempo(120,"Drums");else var e=d.fetchLoopsByTempo(a.duration,"Drums");e.then(function(c){if(0==c.data.length)a.loadTweet(b,!0);else{var d=Math.floor(Math.random()*c.data.length);if(a.loop=c.data[d],a.soundManagerReady){a.fetchClips(a.loop);soundManager.createSound({id:"loop",url:a.cloudfrontUrl+a.loop.s3_key.replace("wav","mp3"),onfinish:function(){soundManager.play("loop")}})}console.log(d,a.loop)}},function(a){console.log(a)})},a.fetchClips=function(b,c){if(console.log(b,b.musical_key),null!==b.musical_key&&c!==!0)var e=d.fetchSamples(b.musical_key);else if(b.packages.length>0&&c!==!0)var e=d.fetchPackage(b.packages[0]);else if(c)var e=d.fetchSamples("E Major");else var e=d.fetchSamples("E Major");e.then(function(c){if(0==c.data.length)a.fetchClips(b,!0);else{var d=(Math.floor(Math.random()*c.data.length),[]);angular.forEach(c.data,function(a,b){""!=a.s3_key&&a.duration<=2e4&&"Ahhhhh"!==a.name?d.push(a):console.log("bad key")}),console.log(d);for(var e=a.activeStrings.length-1;e>=0;e--){if(console.log(d[e]),a.clips[a.activeStrings[e]]=d[e],e>d.length-1){console.log("short samples list");var f=Math.floor(Math.random()*(d.length-1));console.log("short samples list",f,d[f]);var g=a.cloudfrontUrl+d[f].s3_key.replace("wav","mp3")}else var g=a.cloudfrontUrl+d[e].s3_key.replace("wav","mp3");soundManager.createSound({id:"clip_"+a.activeStrings[e],url:g,onfinish:function(){a.nextChar()}})}}soundManager.setVolume("loop",55),soundManager.play("loop"),a.playChar(a.activeTweet[0]),console.log(a.clips)},function(a){})},a.playChar=function(b){if(b){console.log("play for "+b,a.activeIndex);var c="clip_"+b.toUpperCase();soundManager.play(c),a.playing=!0}},a.next=function(){a.activeTweetIndex=a.activeTweetIndex+1,console.log("load next tweet?"),a.$apply()},a.nextChar=function(){a.activeIndex++,a.$apply(),"undefined"==typeof a.activeTweet[a.activeIndex]&&(console.log("stop!"),a.playing=!1,a.next()),a.playChar(a.activeTweet[a.activeIndex])},console.log(a.activeStrings),a.stopAll=function(){a.playing=!1,soundManager.pauseAll()},a.startAll=function(){a.playing=!0,soundManager.play("loop"),a.playChar(a.activeTweet[a.activeIndex])},a.resume=function(){a.playing=!0}}]),angular.module("twauralApp").config(["$routeProvider",function(a){a.when("/:tag",{templateUrl:"app/main/main.html",controller:"MainCtrl"}).when("/tweet/:id",{templateUrl:"app/main/main.html",controller:"MainCtrl"}).when("/",{templateUrl:"app/main/main.html",controller:"MainCtrl"})}]),angular.module("twauralApp").service("sampleService",["$http",function(a){var b="https://hackathon.indabamusic.com/samples";this.fetchLoops=function(c){return a.get(b+"?type=loop&instruments="+c)},this.fetchLoopsByTempo=function(c,d){return 80>c&&(c=80+c),a.get(b+"?type=loop&tempo="+c)},this.fetchPackage=function(c){return a.get(b+"?package_id="+c)},this.fetchSamples=function(c){return a.get(b+"?type=one_shot&musical_key="+c)}}]),angular.module("twauralApp").service("tweetService",["$http",function(a){this.fetchByTag=function(b){return a.get("/api/tweets/"+b)},this.fetchById=function(b){return a.get("/api/tweets/id/"+tag)}}]),angular.module("twauralApp").directive("footer",function(){return{templateUrl:"components/footer/footer.html",restrict:"E",link:function(a,b){b.addClass("footer")}}}),angular.module("twauralApp").controller("NavbarCtrl",["$scope","$location",function(a,b){a.menu=[{title:"Home",link:"/"}],a.isCollapsed=!0,a.isActive=function(a){return a===b.path()}}]),angular.module("twauralApp").directive("navbar",function(){return{templateUrl:"components/navbar/navbar.html",restrict:"E",controller:"NavbarCtrl"}}),angular.module("twauralApp").factory("socket",["socketFactory",function(a){var b=io("",{path:"/socket.io-client"}),c=a({ioSocket:b});return{socket:c,syncUpdates:function(a,b,d){d=d||angular.noop,c.on(a+":save",function(a){var c=_.find(b,{_id:a._id}),e=b.indexOf(c),f="created";c?(b.splice(e,1,a),f="updated"):b.push(a),d(f,a,b)}),c.on(a+":remove",function(a){var c="deleted";_.remove(b,{_id:a._id}),d(c,a,b)})},unsyncUpdates:function(a){c.removeAllListeners(a+":save"),c.removeAllListeners(a+":remove")}}}]),angular.module("twauralApp").run(["$templateCache",function(a){a.put("app/main/main.html","<div id=wrapper ng-style=\"{'background-image': 'url('+bg+')', 'background-color': activeColor, 'box-shadow': 'inset 0 0 0 20px #'+ activeColor}\"><div id=logo><img src=https://dl.dropboxusercontent.com/u/65167501/rt-logo.png></div><form id=search ng-submit=fetchTweets(newTag)><input ng-model=newTag placeholder={{activeTag}}><div ng-click=fetchTweets(newTag)><svg class=btn-update xmlns=http://www.w3.org/2000/svg xmlns:xlink=http://www.w3.org/1999/xlink x=0px y=5px height=20px width=20px viewbox=\"0 0 20.2 20\" enable-background=\"new 0 0 20.2 20\" xml:space=preserve><path fill=#FFF d=\"M17.5,19.9l-4.7-4.7c-1.3,0.8-2.9,1.3-4.5,1.3C3.7,16.5,0,12.8,0,8.3C0,3.7,3.7,0,8.3,0c4.6,0,8.3,3.7,8.3,8.3\n					c0,1.6-0.4,3.1-1.2,4.3l4.8,4.8c0.3,0.2,0,0.9-0.5,1.4l-0.7,0.7C18.4,20,17.8,20.2,17.5,19.9z M13.8,8.3c0-3-2.5-5.5-5.5-5.5\n"+'					c-3,0-5.5,2.5-5.5,5.5s2.5,5.5,5.5,5.5C11.3,13.8,13.8,11.3,13.8,8.3z"></svg></div><!-- <button ng-click="fetchTweets(newTag)">Update</button> --></form><div class=message><div class=avatar ng-style="{\'border-color\': \'#\'+activeColor }"><img ng-src={{userIcon}}></div><h2 class=handle>@{{activeUsername}}</h2><p ng-style="{\'color\': \'#\'+activeColor }"><span ng-repeat="char in activeTweet track by $index" ng-class="{\'active\':activeIndex >= $index}">{{char}}<span><p><div ng-click=startAll() class=button ng-hide=playing><svg class=btn-play fill=#FFF xmlns=http://www.w3.org/2000/svg xmlns:xlink=http://www.w3.org/1999/xlink x=0px y=0px width=50px height=60px viewbox="0 0 16 19.2" enable-background="new 0 0 16 19.2" xml:space=preserve><path d="M15.5,8.8L1.8,0.3C0.8-0.4,0,0.1,0,1.4v16.5c0,1.2,0.8,1.7,1.8,1.1l13.7-8.5c0,0,0.5-0.3,0.5-0.8 C16,9.1,15.5,8.8,15.5,8.8L15.5,8.8z"></svg></div><div ng-click=stopAll() class=button ng-if=playing><svg width=50px height=60px fill=#FFF class=btn-pause xmlns=http://www.w3.org/2000/svg xmlns:xlink=http://www.w3.org/1999/xlink x=0px y=0px viewbox="0 0 17 20.4" enable-background="new 0 0 17 20.4" xml:space=preserve><path d="M14.1,0c-1.6,0-2.9,0.5-2.9,2.1v16.2c0,1.6,1.3,2.1,2.9,2.1s2.9-0.5,2.9-2.1V2.1C17,0.5,15.7,0,14.1,0z M2.9,0\n			C1.3,0,0,0.5,0,2.1v16.2c0,1.6,1.3,2.1,2.9,2.1s2.9-0.5,2.9-2.1V2.1C5.8,0.5,4.5,0,2.9,0z"></svg></div><!-- <button ng-click="stopAll()">Stop</button> --><div ng-click=next() class=button><svg class=btn-next width=50px height=60px fill=#FFF xmlns=http://www.w3.org/2000/svg xmlns:xlink=http://www.w3.org/1999/xlink x=0px y=0px viewbox="0 0 19.2 18.6" enable-background="new 0 0 19.2 18.6" xml:space=preserve><path d="M13.2,8.6L1.6,1.3C0.7,0.7,0,1.1,0,2.2v14.2c0,1.1,0.7,1.5,1.6,0.9L13.2,10c0,0,0.4-0.3,0.4-0.7S13.2,8.6,13.2,8.6,L13.2,8.6z M16.8,0c-1.4,0-2.4,0.4-2.4,1.9v14.9c0,1.4,1,1.9,2.4,1.9s2.4-0.4,2.4-1.9V1.9C19.2,0.4,18.2,0,16.8,0z"></svg></div><!-- <button ng-click="next()">Next</button> --></p></span></span></p></div></div>'),a.put("components/footer/footer.html",'<div class=container><p>Angular Fullstack v3.0.0-rc4 | <a href=https://twitter.com/tyhenkel>@tyhenkel</a> | <a href="https://github.com/DaftMonk/generator-angular-fullstack/issues?state=open">Issues</a></p></div>'),a.put("components/navbar/navbar.html",'<div class="navbar navbar-default navbar-static-top" ng-controller=NavbarCtrl><div class=container><div class=navbar-header><button class=navbar-toggle type=button ng-click="isCollapsed = !isCollapsed"><span class=sr-only>Toggle navigation</span> <span class=icon-bar></span> <span class=icon-bar></span> <span class=icon-bar></span></button> <a href="/" class=navbar-brand>twaural</a></div><div collapse=isCollapsed class="navbar-collapse collapse" id=navbar-main><ul class="nav navbar-nav"><li ng-repeat="item in menu" ng-class="{active: isActive(item.link)}"><a ng-href={{item.link}}>{{item.title}}</a></li></ul></div></div></div>')}]);