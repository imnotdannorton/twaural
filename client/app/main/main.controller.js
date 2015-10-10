'use strict';

angular.module('twauralApp')
  .controller('MainCtrl', ['$scope', '$route', '$location', 'sampleService', 'tweetService', function($scope, $route, $location, sampleService, tweetService) {
    console.log($route.current.params)
    $scope.activeTag = $route.current.params.tag;
    $scope.activeTweetIndex = 0;
    $scope.newTag = "";
    $scope.stopAll = function(){
      soundManager.pauseAll();
      soundManager.reboot();
    }
    $scope.fetchTweets = function(string){
      $scope.stopAll();
      $location.url('/'+string);
      $scope.activeTag = string;
      var getTweets = tweetService.fetchByTag($scope.activeTag);
      getTweets.then(function(data){
        $scope.tweetsList = data.data.statuses;
        $scope.loadTweet($scope.tweetsList[0]);
        console.log($scope.tweetsList);
      }, function(err){

      })
    }
    // get Hashtag
    if($scope.activeTag){
      $scope.fetchTweets($scope.activeTag);
    }
    $scope.activeId = $route.current.params.id;
    $scope.$watch('activeTweetIndex', function(newVal, oldVal){
      console.log("activeTweetIndex", newVal, oldVal)
      if(typeof oldVal != 'undefined'){
        if($scope.tweetsList){
          $scope.loadTweet($scope.tweetsList[$scope.activeTweetIndex])
        }
      }
    })

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
      $scope.bg = object.user.profile_banner_url || object.user.profile_background_image_url || object.user.profile_image_url;
      $scope.userIcon = object.user.profile_image_url;
      $scope.activeColor = object.user.profile_link_color;
      $scope.activeUsername = object.user.screen_name;
      console.log("background ", $scope.bg, " icon ", $scope.userIcon)
      $scope.activeTweet = object.text;
      $scope.origTweet = object.text;
      $scope.activeTweet = $scope.activeTweet.replace(/ /g, '_');
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
          console.log("loop index", data, index, $scope.duration)
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
      if(object.musical_key !== null){
        var getClips = sampleService.fetchSamples(object.musical_key);
      }else if(object.packages.length > 0){
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
          // push the number of samples we need
          for (var i = $scope.activeStrings.length - 1; i >= 0; i--) {
            console.log(index, i, data.data[i].s3_key)
            $scope.clips[$scope.activeStrings[i]] = data.data[i];
            if(data.data[i].s3_key.length == 0){
              var link = $scope.cloudfrontUrl + data.data[i+1].s3_key.replace('wav', 'mp3');
            }else{
              var link = $scope.cloudfrontUrl + data.data[i].s3_key.replace('wav', 'mp3');
            }
            soundManager.createSound({
              id:'clip_'+$scope.activeStrings[i],
              url: link,
              onfinish: function(){
                $scope.nextChar();
              }
              // onload:function(){
              //   this.onPosition(this.duration - 200, function() {
              //     $scope.nextChar();
              //   })
              // }
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
        console.log('play for ' + string);
        var activeSound = 'clip_'+string.toUpperCase();
        soundManager.play(activeSound)
      }
    }
    $scope.nextChar = function(){
      // var checkIndex = function (index){
      //   if($scope.activeTweet[$scope.activeIndex] == $scope.activeTweet[$scope.activeIndex-1]){
      //     console.log($scope.activeTweet[$scope.activeIndex], " is the same as", $scope.activeTweet[$scope.activeIndex-1]);
      //     $scope.activeIndex++;
      //     checkIndex($scope.activeIndex);
      //   }else{
      //     $scope.activeIndex++;
      //   }
      // }
      $scope.activeIndex++;
      $scope.$apply();
      // checkIndex();
      console.log('activeIndex', $scope.activeIndex, $scope.activeTweet[$scope.activeIndex], $scope.activeTweet.length);
      // $scope.activeTweet[$scope.activeIndex];
      if(typeof $scope.activeTweet[$scope.activeIndex] == 'undefined'){
        console.log('stop!')
        soundManager.stopAll();
        soundManager.reboot();
      }
      $scope.playChar($scope.activeTweet[$scope.activeIndex]);
    }
    console.log($scope.activeStrings);
    $scope.stopAll = function(){
      soundManager.pauseAll();
      soundManager.reboot();
    }
    $scope.next = function(){
      $scope.stopAll();
      $scope.activeTweetIndex++;
    }
    $scope.startAll = function(){
      // Play Loop
      soundManager.play('loop');
      // play first sample
      $scope.playChar($scope.activeTweet[0]);
    }
  }]);
