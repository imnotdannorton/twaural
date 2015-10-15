'use strict';

angular.module('twauralApp')
  .controller('MainCtrl', ['$scope', '$route', '$location', 'sampleService', 'tweetService', function($scope, $route, $location, sampleService, tweetService) {
    // console.log($route.current.params)
    $scope.activeTag = $route.current.params.tag;
    $scope.activeTweetIndex = 0;
    $scope.newTag = "";
    $scope.stopAll = function(){
      soundManager.pauseAll();
      soundManager.reboot();
    }
    $scope.fetchTweets = function(string){
      $scope.stopAll();
      soundManager.reboot();
      $location.url('/'+string);
      $scope.activeTag = string;
      var getTweets = tweetService.fetchByTag($scope.activeTag);
      getTweets.then(function(data){
        $scope.tweetsList = data.data.statuses;
        $scope.loadTweet($scope.tweetsList[0]);
      }, function(err){

      })
    }
    // get Hashtag
    if($scope.activeTag){
      $scope.fetchTweets($scope.activeTag);
    }else{
      $scope.fetchTweets('rubbertracks');
    }
    $scope.activeId = $route.current.params.id;
    $scope.$watch('activeTweetIndex', function(newVal, oldVal){
      console.log("updated activeTweetIndex", newVal, oldVal);
      if(typeof oldVal != 'undefined'){
        if($scope.tweetsList){
          $scope.loadTweet($scope.tweetsList[newVal])
        }
      }
    }, true);

    $scope.cloudfrontUrl = 'https://d34x6xks9kc6p2.cloudfront.net/'
    // set up sound object
    soundManager.setup({
      url:'bower_components/SoundManager2/swf/',
      debugMode: false,
      onready:function(){
        console.log("sm ready!");
        $scope.soundManagerReady = true;
      }
    })
    
    $scope.loadTweet = function(object, tempoOverride){
      angular.forEach(soundManager.sounds, function(val, key){
        console.log("killing ", val);
        soundManager.destroySound(val.id);
      })
      console.log(soundManager)
      $scope.bg = object.user.profile_banner_url || object.user.profile_background_image_url || object.user.profile_image_url;
      $scope.userIcon = object.user.profile_image_url.replace('_normal', '');
      $scope.activeColor = object.user.profile_link_color;
      $scope.activeUsername = object.user.screen_name;
      // console.log("background ", $scope.bg, " icon ", $scope.userIcon)
      $scope.activeTweet = object.text;
      $scope.origTweet = object.text;
      $scope.activeTweet = $scope.activeTweet.replace(/  /g, " ");
      $scope.activeTweet = $scope.activeTweet.split(" ");
      $scope.duration = $scope.activeTweet.length;
      $scope.clips = {};
      $scope.activeIndex = 0;
      // extract characters
      $scope.activeStrings = []
      angular.forEach($scope.activeTweet, function(val, key){
        if($scope.activeStrings.indexOf(val.toUpperCase()) == -1 ){
          $scope.activeStrings.push(val.toUpperCase())
        }
      })
       // get loops by tweet length
      if(tempoOverride){
        var getLoops = sampleService.fetchLoopsByTempo(120, 'Drums')
      }else{
        var getLoops = sampleService.fetchLoopsByTempo($scope.duration, 'Drums')
      }
      getLoops.then(function(data){
        if(data.data.length == 0){
          $scope.loadTweet(object, true);
        }else{
          var index = Math.floor((Math.random()*data.data.length));
          // console.log("loop index", data, index, $scope.duration)
          $scope.loop = data.data[index];
          if($scope.soundManagerReady){
            $scope.fetchClips($scope.loop);
            var loop = soundManager.createSound({
              id: 'loop',
              url: $scope.cloudfrontUrl + $scope.loop.s3_key.replace('wav', 'mp3'),
              onfinish: function(){
                soundManager.play('loop');
              }
            })
          }
          console.log(index, $scope.loop);
        }
      }, function(err){
        console.log(err);
      })

    }
    
    // get clips array from loop
    $scope.fetchClips = function(object, keyOverride){
      console.log(object, object.musical_key);
      if(object.musical_key !== null && keyOverride !== true){
        var getClips = sampleService.fetchSamples(object.musical_key);
      }else if(object.packages.length > 0 && keyOverride !== true){
        var getClips = sampleService.fetchPackage(object.packages[0])
      }else if(keyOverride){
        var getClips = sampleService.fetchSamples("E Major");
      }else{
        var getClips = sampleService.fetchSamples("E Major");
      }
      getClips.then(function(data){
        if(data.data.length == 0){
          $scope.fetchClips(object, true)
        }else{
          // start at random sample spot
          var index = Math.floor((Math.random()*data.data.length));
          // push the good samples we need
          var samplesList = []
          angular.forEach(data.data, function(val, key){
            if(val.s3_key != "" && val.duration <= 20000 && val.name !== 'Ahhhhh'){
              samplesList.push(val);
            }else{
              console.log('bad key');
            }
          });
          console.log(samplesList);
          for (var i = $scope.activeStrings.length - 1; i >= 0; i--) {
            console.log(samplesList[i])
            $scope.clips[$scope.activeStrings[i]] = samplesList[i];
            if(i > samplesList.length-1){
              console.log("short samples list")
              var x = Math.floor((Math.random()*(samplesList.length-1)));
              console.log("short samples list", x, samplesList[x])
              var link = $scope.cloudfrontUrl + samplesList[x].s3_key.replace('wav', 'mp3');
            }else{
              var link = $scope.cloudfrontUrl + samplesList[i].s3_key.replace('wav', 'mp3');
            }
            soundManager.createSound({
              id:'clip_'+$scope.activeStrings[i],
              url: link,
              onfinish: function(){
                $scope.nextChar();
              }
            })
          };
        }
        // Play Loop
        soundManager.setVolume('loop', 55);
        soundManager.play('loop');
        // play first sample
        $scope.playChar($scope.activeTweet[0]);

        console.log($scope.clips);
      }, function(err){

      })
    }
    $scope.playChar = function(string){
      if (string){
        console.log('play for ' + string, $scope.activeIndex);
        var activeSound = 'clip_'+string.toUpperCase();
        soundManager.play(activeSound);
        $scope.playing = true;
      }
    }
    $scope.next = function(){
      // $scope.stopAll();
      $scope.activeTweetIndex = $scope.activeTweetIndex+1;
      console.log('load next tweet?');
      $scope.$apply();
    }
    $scope.nextChar = function(){
      $scope.activeIndex++;
      $scope.$apply();
      if(typeof $scope.activeTweet[$scope.activeIndex] == 'undefined'){
        console.log('stop!');
        $scope.playing = false;
        // soundManager.stopAll();
        // soundManager.reboot();
        $scope.next();
      }
      $scope.playChar($scope.activeTweet[$scope.activeIndex]);
    }
    console.log($scope.activeStrings);
    $scope.stopAll = function(){
      $scope.playing = false;
      soundManager.pauseAll();
      // soundManager.reboot();
    }
    
    $scope.startAll = function(){
      $scope.playing = true;
      // Play Loop
      soundManager.play('loop');
      // play first sample
      // soundManager.resumeAll();
      $scope.playChar($scope.activeTweet[$scope.activeIndex]);
    }
    $scope.resume = function(){
      $scope.playing = true;
    }
  }]);
