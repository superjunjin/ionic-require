AV.initialize("gjkngp4vstrbmd5b0kjljku034cmv90oanbgc51p61dab0ca", "0xjlkc0ylvqnqzv7nzfcwn1opu3mruqhw9g9y85wkupwcxlt");

angular.module('todo.io.controllers', [])

// *******************
// 向导页面
// *******************
.controller('TutorialCtrl', function($scope, $state, $ionicViewService) {

	var startApp = function() {
		$ionicViewService.clearHistory();
		// 默认进入待确认需求列表
		$state.go('sign', {});

	};

	if (window.localStorage['didTutorial'] === "true") {
		console.log('Skip intro');
		// 向导页面只显示一次
		startApp();
	} else {
		window.localStorage['didTutorial'] = true;
		setTimeout(function() {
			navigator.splashscreen.hide();
		}, 750);
	}

	// "立即体验"按钮Event
	$scope.gotoMain = function() {
		startApp();
	}

	$scope.slideHasChanged = function(index) {};
})

// *******************
// 登录页面
// *******************
.controller('SignCtrl', function($scope, $rootScope, $state,$cordovaToast,$cordovaFile,$ionicLoading) {

//  $ionicLoading.hide();
    $scope.errors ;
	$scope.name = "";
	$scope.password = "";
	$scope.authority = "";
	$rootScope.authority = 0;
	$rootScope.name = "";

//  $scope.upLoad = function(){
//  	alert(document.getElementById("profilePhotoFileUpload").value);
//  	
//  	var fileUploadControl = document.getElementById("profilePhotoFileUpload").value;
//      if (fileUploadControl.files.length > 0) {
//         var file = fileUploadControl.files[0];
//         var name = "photo.jpg";
//
//         var avFile = new AV.File(name, file);
//        avFile.save().then(function() {
//        	alert("success");
//         // The file has been saved to AV.
//        }, function(error) {
//        	alert("fail");
//        // The file either could not be read, or could not be saved to AV.
//        });
//      }
//  }

	$scope.signIn = function() {
		$ionicLoading.show({
            template: 'Loading...'
        });
		$scope.name = document.getElementById("name").value;
		$scope.password = document.getElementById("password").value;
		$rootScope.name = $scope.name;
		window.localStorage['userName'] = $scope.name;
		window.localStorage['userPassword'] = $scope.password;

		var Users = AV.Object.extend("Users");
		var query = new AV.Query(Users);
		query.equalTo("username", $scope.name);
		query.equalTo("password", $scope.password);
		query.first({
			success: function(object) {
				// Successfully retrieved the object.
				$ionicLoading.hide();
				if (object == null) {
					
					$cordovaToast.show('登录失败', 'long', 'bottom');
//					alert("path    "+cordova.file.externalRootDirectory+"pic.jpg");
					
//					$cordovaFile.writeFile(cordova.file.externalRootDirectory, "file.txt", "text1036", true)
//    .then(function (success) {
//    	 alert("success"+success);
//      // success
//    }, function (error) {
//    	 alert("fail"+error);
//      // error
//    });

    
					
//					$cordovaFile.readAsDataURL(cordova.file.externalRootDirectory, "bann.jpg")
//                  .then(function (success) {
//                     alert("success"+success);
//                  }, function (error) {
//                     alert("error"+error);
//                     $scope.errors = error;
//                  });
							
				} else {
					$scope.authority = object.get("authority");
					if ($scope.authority == "first") {
						
//						$cordovaToast.show('一等权限用户，登陆成功', 'long', 'bottom'); 
						
						$rootScope.authority = 1;
						
					} else if ($scope.authority == "second") {
						
						$cordovaToast.show('二等权限用户，登陆成功', 'long', 'bottom');
		
						$rootScope.authority = 2;
					
					} else if ($scope.authority == "third") 
					{
						$cordovaToast.show('三等权限用户，登陆成功', 'long', 'bottom');
						
						$rootScope.authority = 3;
					} else {

					}
					// 默认进入待确认需求列表
					$state.go('app.todolist', {
						groupId: 1
					});
				}

			},
			error: function(error) {
				$ionicLoading.hide();
				alert("Error: " + error.code + " " + error.message);

			}
		});

        




	}







})

// *******************
// 菜单
// *******************
.controller('AppCtrl', function($scope, $state, MenuService, dummyData, localStorageService) {

	// 初始化菜单项目
	var findDisplayMenus = function() {
		MenuService.findAll(true).then(function(menus) {
			$scope.menus = menus;

		});
	}
	findDisplayMenus();

	// "设置"按钮Event
	$scope.settings = function() {
		$state.go('app.settings', {});
	}

	// "添加列表"按钮Event
	$scope.addGroup = function() {
		$state.go('app.groupinfo', {});
	}

	// "编辑"按钮Event
	$scope.editGroup = function() {
		$state.go('app.grouplist', {});
	}
})

// *******************
// 任务一览页面
//  $stateParams.groupId
// *******************
.controller('TodolistsCtrl', function($scope, $rootScope, $state, $stateParams, $timeout,
	$ionicGesture, $ionicActionSheet, $ionicNavBarDelegate,
	MenuService, TodoListService, $http,$cordovaToast,$ionicLoading) {

	$scope.authority = $rootScope.authority;
	//orderby的排序类型
	$scope.expression = 'requireId';
	//true为降序
	$scope.reverse = true;
	$rootScope.taskGroupId = $stateParams.groupId;

	// 从向导页面跳转过来的话，不显示返回按钮
	$timeout(function() {
		$ionicNavBarDelegate.showBackButton(false);
	}, 0);


	// 根据列表ID显示初始数据
	var findAllTodos = function() {
		MenuService.findGroupName($stateParams.groupId).then(function(group) {
			$scope.groupName = group[0].title; //类名
			$scope.groupId = $stateParams.groupId;
		});

		TodoListService.findByGroupId($stateParams.groupId).then(function(todolists) {

			$scope.todolists = todolists; //对应类别的所有数据list
		});
	}
	findAllTodos();


	//$scope.toMenu = function(){
	//	 var findDisplayMenus = function() {
	//  MenuService.findAll(true).then(function(menus) {
	//    $scope.menus = menus;
	//  });
	//}
	// }

//  $scope.loginOut = function(){
//  	$state.go('sign', {});
//  }

	// "添加"按钮Event
	$scope.add = function() {

			$state.go('app.todoinfo', {
				groupId: $stateParams.groupId
			});
		}
		//刷新
	$scope.refresh = function() {
//		$http.get("http://localhost:3000/refresh")
//			.success(function(data, status, headers, config) {
//				// this callback will be called asynchronously
//				// when the response is available
//
//				alert("success");
//				alert("[" + data.substring(0, data.lastIndexOf(",")) + "]");
//				TodoListService.deleteAndAddTask(JSON.parse("[" + data.substring(0, data.lastIndexOf(",")) + "]"));
//				TodoListService.findByGroupId($stateParams.groupId).then(function(todolists) {
//
//					$scope.todolists = todolists; //对应类别的所有数据list
//				});
//
//			})
//			.error(function(data, status, headers, config) {
//				// called asynchronously if an error occurs
//				// or server returns response with an error status.
//				alert("error " + data);
//
//			});


		//      .success(function(response) {
		//
		//          console.log(response);
		//          alert(response);
		//      });
        $ionicLoading.show({
            template: 'Loading...'
        });
		var todoss = [];
		var Requires = AV.Object.extend("Requires");
		var query = new AV.Query(Requires);
		
		query.find({
			success: function(results) {
				// Successfully retrieved the object.
				$ionicLoading.hide();
				$cordovaToast.show('刷新成功', 'long', 'bottom')
				;
                
				 if (results == null) {
			        $cordovaToast.show('没有需求数据', 'long', 'bottom');
               
				 }else {
					
					for (var i = 0; i < results.length; i++) {
                         var object = results[i];
                         todoss.push({requireId: object.get('requireId'), groupId: object.get('groupId'), importance: object.get('importance')
                         , classname:object.get('classname') , title: object.get('title'), date: object.get('date'), detail: object.get('detail')
                         ,images:object.get('images'),name:object.get('name'),record:object.get('record'),donedate:object.get('donedate')});
                    }
					
					TodoListService.deleteAndAddTask(todoss);
				    TodoListService.findByGroupId($stateParams.groupId).then(function(todolists) {

					   $scope.todolists = todolists; //对应类别的所有数据list
				    });
					
				}

			},
			error: function(error) {
				$ionicLoading.hide();
				$cordovaToast.show('刷新失败'+'Error: ' + error.code + '  ' + error.message, 'long', 'bottom');
			    
			}
		});

	}

	// "搜索"Event
	$scope.search = function() {
		$state.go('app.search', {});
	}

	// "排序"Event
	var nonePopover = function() {
		for (var i = 1; i <= 10; i++) {
			var p = angular.element(document.querySelector('#nspopover-' + i));
			p.css('display', 'none');
		}
	}
	$scope.sort = function() {
		nonePopover();
		$ionicActionSheet.show({
			buttons: [{
				text: '按<b>发布日期</b>排序'
			}, {
				text: '按<b>完成日期</b>排序'
			}, {
				text: '按<b>标题</b>排序'
			}, {
				text: '按<b>重要度</b>排序'
			}],
			titleText: '选择排序方法',
			cancelText: '关闭',
			cancel: function() {
				return true;
			},
			buttonClicked: function(index) {
				var sortKey = "";

				switch (index) {
					case 0:
						$scope.expression = "requireId";
						$scope.reverse = true;
						break;
					case 1:
						$scope.expression = "donedate";
						$scope.reverse = false;
						break;
					case 2:
						$scope.expression = "title";
						$scope.reverse = true;
						break;
					case 3:
						$scope.expression = "importance";
						$scope.reverse = true;
						break;
					default:
						$scope.expression = "requireId";
						$scope.reverse = true;
				}
				TodoListService.findByGroupId($stateParams.groupId, sortKey).then(function(todolists) {
					$scope.todolists = todolists; // 未完成
				});
				return true;
			}
		});
	}

	// 点击Listview跳转到任务详细页面
	$scope.show = function(todoid) {

		$state.go('app.todoinfo', {
			todoId: todoid
		});
	}

	// 点击Listview中的Checkbox结束当前任务
	$scope.finish = function(todoid, $event) {
		// TODO
		$event.stopPropagation();
	}

	// 长按Listview跳转到任务批量处理页面
	var element = angular.element(document.querySelector('#todolist'));
	$ionicGesture.on("hold", function(event) {
		if ($scope.authority == 1) {
			$state.go('app.todolistedit', {
				groupId: $stateParams.groupId
			});
		}

	}, element);

})

// *******************
// 任务批量处理页面
//  $stateParams.groupId
// *******************
.controller('TodolistsEditCtrl', function($scope, $state, $stateParams, $timeout,
	$ionicGesture, $ionicActionSheet, $ionicNavBarDelegate,
	MenuService, TodoListService, $cordovaDialogs, $cordovaDatePicker,$ionicLoading) {

	// 当前group所有的任务
	$scope.entities = [];
	$scope.expression = "requireId";

	// 根据列表ID显示初始数据
	var findAllTodos = function() {

		TodoListService.findByGroupId($stateParams.groupId).then(function(todolists) {
			$scope.todolists = todolists; // 已完成
			$scope.entities = $scope.entities.concat(todolists);
		});
	}
	findAllTodos();

	// 选中处理
	$scope.selected = [];
	var updateSelected = function(action, id) {

		if (action === 'add' && $scope.selected.indexOf(id) === -1) {
			$scope.selected.push(id);
		}
		if (action === 'remove' && $scope.selected.indexOf(id) !== -1) {
			$scope.selected.splice($scope.selected.indexOf(id), 1);
		}
	};
	$scope.updateSelection = function($event, id) {

		var checkbox = $event.target;
		//add(选中的添加到删除列表），remove(未选中的移除删除列表))
		var action = (checkbox.checked ? 'add' : 'remove');
		updateSelected(action, id);
		$ionicNavBarDelegate.setTitle("选中" + $scope.selected.length + "项");
		console.log($scope.selected);
	};
	$scope.selectAll = function($event) {
		var action = ($scope.isSelectedAll() ? 'remove' : 'add');
		for (var i = 0; i < $scope.entities.length; i++) {
			var entity = $scope.entities[i];
			updateSelected(action, entity.id);
		}
		$ionicNavBarDelegate.setTitle("选中" + $scope.selected.length + "项");
	};
	$scope.getSelectedClass = function(entity) {
		return $scope.isSelected(entity.id) ? 'selected' : '';
	};
	$scope.isSelected = function(id) {

		return $scope.selected.indexOf(id) >= 0;
	};
	$scope.isSelectedAll = function() {
		return $scope.selected.length === $scope.entities.length;
	};
	
    var Requires = AV.Object.extend("Requires");
    
    var updateStatus  = function(updateid,groupid){
    	$ionicLoading.show({
            template: 'Loading...'
        });
       var query = new AV.Query(Requires);
       query.equalTo("requireId", updateid);
       query.find({
	       success: function(results) {
		   $ionicLoading.hide();

		   var object = results[0];

		   object.set("groupId", groupid);

		   object.save();
		   $cordovaToast.show('更新需求状态成功', 'long', 'bottom');
	       },
	       error: function(error) {
	       	   $ionicLoading.hide();
		       alert("Error: " + error.code + " " + error.message);
	       }
        });
    }
	// "批量改变状态"Event
	$scope.move = function(todoid) {
		//待确认需求（确认或否决）
		if ($stateParams.groupId == 1) {
			$cordovaDialogs.confirm('是否确认批量更改需求状态', '更改需求状态', ['取消', '确认'])
				.then(function(buttonIndex) {

					var btnIndex = buttonIndex;

					if (btnIndex == 2) {
						$cordovaDialogs.confirm('请确认或否决需求', '确认需求', ['否决', '确认'])
							.then(function(buttonIndex) {

								var btnIndex = buttonIndex;

								if (btnIndex == 2) {
									TodoListService.updateTaskItemStatus($scope.selected, 2);
									for(var i in $scope.selected)
									{
										updateStatus($scope.selected[i],2);
									}

									$state.go('app.todolist', {
										groupId: $stateParams.groupId
									});
								} else if (btnIndex == 1) {
									TodoListService.updateTaskItemStatus($scope.selected, 3);
									for(var i in $scope.selected)
									{
										updateStatus($scope.selected[i],3);
									}
									$state.go('app.todolist', {
										groupId: $stateParams.groupId
									});
								} else {

								}

							});
					} else {

					}

				});
		}
		//确认需求（完成和未完成（确认状态））
		else if ($stateParams.groupId == 2) {
			$cordovaDialogs.confirm('是否确认批量更改需求状态', '更改需求状态', ['取消', '确认'])
				.then(function(buttonIndex) {

					var btnIndex = buttonIndex;

					if (btnIndex == 2) {
						$cordovaDialogs.confirm('是否为已完成需求', '确认需求', ['否', '是'])
							.then(function(buttonIndex) {

								var btnIndex = buttonIndex;

								if (btnIndex == 2) {
									TodoListService.updateTaskItemStatus($scope.selected, 4);
									for(var i in $scope.selected)
									{
										updateStatus($scope.selected[i],4);
									}
									$state.go('app.todolist', {
										groupId: $stateParams.groupId
									});
								} else if (btnIndex == 1) {
									TodoListService.updateTaskItemStatus($scope.selected, 2);
									for(var i in $scope.selected)
									{
										updateStatus($scope.selected[i],2);
									}
									$state.go('app.todolist', {
										groupId: $stateParams.groupId
									});
								} else {

								}

							});
					} else {

					}

				});
		}


	}
    var updateDate  = function(updateid,donedate){
    	$ionicLoading.show({
            template: 'Loading...'
        });
       var query = new AV.Query(Requires);
       query.equalTo("requireId", updateid);
       query.find({
	         success: function(results) {
		     $ionicLoading.hide();

		     var object = results[0];

		     object.set("donedate", donedate);

		     object.save();
		     $cordovaToast.show('更新完成日期成功', 'long', 'bottom');
	         },
	         error: function(error) {
	         	$ionicLoading.hide();
		        alert("Error: " + error.code + " " + error.message);
	         }
         });
    }
	// "批量设置时间"Event
	$scope.setDate = function(todoid) {

		if ($stateParams.groupId == 1) {
			$cordovaDialogs.confirm('是否确认批量设置需求完成时间', '设置完成时间', ['取消', '确认'])
				.then(function(buttonIndex) {
					// no button = 0, 'OK' = 1, 'Cancel' = 2
					var btnIndex = buttonIndex;

					if (btnIndex == 2) {
						var options = {
							date: new Date(),
							mode: 'date', // or 'time'
							minDate: new Date() - 10000,
							allowOldDates: true,
							allowFutureDates: true,
							doneButtonLabel: 'DONE',
							doneButtonColor: '#F2F3F4',
							cancelButtonLabel: 'CANCEL',
							cancelButtonColor: '#000000'
						};


						$cordovaDatePicker.show(options).then(function(date) {

							TodoListService.updateTaskItemDate($scope.selected, date.Format("yyyy-MM-dd"));
							for(var i in $scope.selected)
							{
								updateDate($scope.selected[i], date.Format("yyyy-MM-dd"));
							}
							// history.go(-1);
							$state.go('app.todolist', {
								groupId: $stateParams.groupId
							});
						});



					} else {

					}

				});
		}

	}

	// "批量删除"Event
	$scope.deleteTodo = function(todoid) {

		$cordovaDialogs.confirm('是否确认删除这些需求', '删除确认', ['取消', '确认'])
			.then(function(buttonIndex) {
				// no button = 0, 'OK' = 1, 'Cancel' = 2
				var btnIndex = buttonIndex;

				if (btnIndex == 2) {
					TodoListService.deleteTaskItem($scope.selected, $stateParams.groupId);
					// history.go(-1);
					$state.go('app.todolist', {
						groupId: $stateParams.groupId
					});
				} else {

				}

			});



	}
})

// *******************
// 搜索页面
// *******************
.controller('SearchCtrl', function($scope, $state, $stateParams, TodoListService, $rootScope) {
	$scope.searchKey = "";

	　　 // "搜索任务"Event
	$scope.searchToDo = function(searchKey) {
		if (searchKey != undefined && searchKey != "")　 {
			TodoListService.findByTitle(searchKey).then(function(todolists) {
				$scope.todolists = todolists;
			});
		}
	}

	// 点击Listview跳转到任务详细页面
	$scope.show = function(todoid, groupid) {
		$rootScope.taskGroupId = groupid;

		$state.go('app.todoinfo', {
			todoId: todoid
		});
	}
})

// *******************
// 任务页面
//  $stateParams.todoId
// *******************
.controller('TodoCtrl', function($scope, $rootScope, $state, $stateParams, $ionicActionSheet, $ionicActionSheet, TodoListService, localStorageService, $cordovaImagePicker
	, $cordovaCamera, $cordovaCapture, $cordovaFileOpener2, $cordovaDatePicker, $http,$cordovaToast,$cordovaFile,$ionicLoading) {
	// 任务ID（非空编辑，空的话新建）


	var todoid = $stateParams.todoId;
	//新建任务的标题，详情，分类id，新增条目id
	$scope.authority = $rootScope.authority;
	$scope.task_title = "";
	$scope.task_detail = "";
	$scope.task_groupid = parseInt($rootScope.taskGroupId);
	$scope.task_id = (new Date()).getTime();
	$scope.classname = 'checkbox-stable';

	$scope.mode = "text";
	$scope.title = "需求";
	$scope.newItem = '';
	$scope.priority_level = 0;
	//创建日期
	$scope.todo_date = Date.today();
	//完成日期
	$scope.done_date = (new Date()).Format("yyyy-MM-dd");
    //存储图片列表路径的数组
	$scope.images_list = [];
	var images_paths = [];
	//存储图片列表的base-64编码的字符串
	$scope.images_list_64 = [];
	//用户名
	$scope.name = $rootScope.name;
	//录音文件路径
	$scope.recordPath = "";
	//更改对应的标题显示
	if ($scope.task_groupid == 1) {
		$scope.title = "待确认";
	} else if ($scope.task_groupid == 2) {
		$scope.title = "已确认";
	} else if ($scope.task_groupid == 3) {
		$scope.title = "已否决";
	} else if ($scope.task_groupid == 4) {
		$scope.title = "已完成";
	} else {
		$scope.title = "需求";
	}
	//待确认和已确认的显示改变状态按钮

	// 获取需求条目的内容
	var findTaskItem = function() {
			TodoListService.findTaskItem(todoid).then(function(item) {

				$scope.task_title = item[0].title;
				$scope.task_detail = item[0].detail;
				$scope.images_list = item[0].images;
				$scope.done_date = item[0].donedate;
				$scope.recordPath = item[0].record;
				$scope.priority_level = item[0].importance;
				$scope.classname = item[0].classname;
				$scope.todo_date = item[0].date;
				$scope.name = item[0].name;

			});
	}
	//遍历本地图片地址列表，判断文件是否存在，不存在（从服务端取得64编码数据显示）
	var getImgFromNet = function(){
		alert("img");
		images_paths = $scope.images_list;
//	    for (var i = 0; i < $scope.images_list.length; i++) {
//	    	
//	    }
		for(var i in images_paths){
       		 var path = images_paths[i];
       		 alert(path);
//     		 alert("path   "+path.substring(0,path.lastIndexOf('/'))+"\n"+
//     		       "file   "+path.substring(path.lastIndexOf('/')))
//			  $cordovaFile.checkFile(path.substring(0,path.lastIndexOf('/')), path.substring(path.lastIndexOf('/')))
//    .then(function (success) {
//    	alert("have");
//      // success
//    }, function (error) {
//    	alert("not");
//      // error
//    });
		}
	}

		// 点击条目进入详情页todoid
	if (typeof(todoid) != "undefined" && todoid != "") {
		findTaskItem();
//		getImgFromNet();
	}

	var nonePopover = function() {
			for (var i = 1; i <= 10; i++) {
				var p = angular.element(document.querySelector('#nspopover-' + i));
				p.css('display', 'none');
			}
		}
		//1,进入待确认的需求，弹出确认和否决
		//2,进入已确认的需求，弹出完成和未完成（确认状态）
	$scope.changeStatus = function() {
		if ($scope.task_groupid == 1) //待确认
		{
			$ionicActionSheet.show({
				buttons: [{
					text: '确认需求'
				}, {
					text: '否决需求'
				}],
				cancelText: '关闭',
				cancel: function() {
					return true;
				},
				buttonClicked: function(index) {

					switch (index) {
						//groupid变为2
						case 0:
							$scope.task_groupid = 2;
							break;
							//groupid变为3
						case 1:
							$scope.task_groupid = 3;
							break;

						default:
							break;
					}
					return true;
				}
			});
		} else if ($scope.task_groupid == 2) //已确认
		{
			$ionicActionSheet.show({
				buttons: [{
					text: '已完成需求'
				}, {
					text: '未完成需求'
				}],
				cancelText: '关闭',
				cancel: function() {
					return true;
				},
				buttonClicked: function(index) {

					switch (index) {
						//groupid变为4
						case 0:
							$scope.task_groupid = 4;
							break;
							//groupid变为2
						case 1:
							$scope.task_groupid = 2;
							break;

						default:
							break;
					}
					return true;
				}
			});
		} else {

		}

	}

	// "添加附件"Event
	$scope.addAttachment = function() {
		nonePopover();
		$ionicActionSheet.show({
			buttons: [{
				text: '相机'
			}, {
				text: '图库'
			}, {
				text: '录音'
			}],
			cancelText: '关闭',
			cancel: function() {
				return true;
			},
			buttonClicked: function(index) {

				switch (index) {

					case 0:
						//						appendByCamera();
						pickCameraImage();
						break;
					case 1:
						//      appendByGallery();
						pickImage();
						break;
					case 2:

						pickRecord();
						break;
					default:
						break;
				}
				return true;
			}
		});
	}

	// 拍照添加文件
	function appendByCamera() {
		plus.camera.getCamera().captureImage(function(p) {

		});
	}

	// 从相册添加文件
	function appendByGallery() {
		plus.gallery.pick(function(p) {

		});
	}

	//ngCordova的选取图片的方法
	var pickImage = function() {

		var options = {
			maximumImagesCount: 3,
			width: 800,
			height: 800,
			quality: 60
		};

		$cordovaImagePicker.getPictures(options)
			.then(function(results) {
				for (var i in results) {
					
//					alert("path  "+ results[i]+"\n"+                                     
//					      "file  "+ results[i].substring(results[i].lastIndexOf('/')+1))
					$cordovaFile.readAsDataURL(cordova.file.applicationStorageDirectory, "cache" + results[i].substring(results[i].lastIndexOf('/')))
                    .then(function (success) {
                    	$scope.images_list.push(success);
                    }, function (error) {
                       alert("error"+error);
                    });
//                  $cordovaFile.readAsDataURL(results[i], results[i].substring(results[i].lastIndexOf('/')+1))
//                  .then(function (success) {
//                  	$scope.images_list.push(success);
//                  }, function (error) {
//                     alert("error"+error);
//                  });
                    
//                  $cordovaFile.checkFile(cordova.file.applicationStorageDirectory, "cache" + results[i].substring(results[i].lastIndexOf('/')))
//    .then(function (success) {
//    	alert("have");
//      // success
//    }, function (error) {
//    	alert("not");
//      // error
//    });
                    
//					$scope.images_list.push(results[i]);
				}

			}, function(error) {
				// error getting photos
				alert(error);
			});

	}

	//ngCordova的拍照获取图片的方法
	var pickCameraImage = function() {
		var options = {
			destinationType: Camera.DestinationType.FILE_URI,
			sourceType: Camera.PictureSourceType.CAMERA,

			saveToPhotoAlbum: true
		};

		$cordovaCamera.getPicture(options).then(function(imageURI) {

//			$scope.images_list.push(imageURI);
			
//			alert("path  "+imageURI+"\n"+                                     
//					      "file  "+ imageURI.substring(imageURI.lastIndexOf('/')+1))
					$cordovaFile.readAsDataURL(cordova.file.externalRootDirectory, "DCIM/Camera" + imageURI.substring(imageURI.lastIndexOf('/')))
                    .then(function (success) {
                    	$scope.images_list.push(success);
                    }, function (error) {
                       alert("error"+error);
                    });
//					$cordovaFile.readAsDataURL(imageURI, imageURI.substring(imageURI.lastIndexOf('/')+1))
//                  .then(function (success) {
//                  	$scope.images_list.push(success);
//                  }, function (error) {
//                     alert("error"+error);
//                  });
                    
//     $cordovaFile.checkFile(cordova.file.externalRootDirectory, "DCIM/Camera" + imageURI.substring(imageURI.lastIndexOf('/')))
//    .then(function (success) {
//    	alert("have");
//      // success
//    }, function (error) {
//    	alert("not");
//      // error
//    });
                    
		}, function(err) {
			alert(err)
				// error
		});

	}

	var pickRecord = function() {

		var options = {
			limit: 1,
			duration: 30
		};

		$cordovaCapture.captureAudio(options).then(function(audioData) {
			alert(audioData[0].fullPath.substr(5));
			$scope.recordPath = audioData[0].fullPath.substr(5);
			// Success! Audio data is here
		}, function(err) {
			// An error occurred. Show a message to the user
		});

		//  var options = { limit: 3 };
		//
		//  $cordovaCapture.captureImage(options).then(function(imageData) {
		//  	alert(imageData);
		//    // Success! Image data is here
		//  }, function(err) {
		//    // An error occurred. Show a message to the user
		//  });

	}

	$scope.priority = function($event) {
		$event.stopPropagation();
	}

	// "设置重要度"Event
	$scope.setPriority = function(p) {
		$scope.priority_level = p;

		if (p == 3) //重要（红色）
		{
			$scope.classname = 'checkbox-assertive';
		} else if (p == 2) //中等（黄色）
		{
			$scope.classname = 'checkbox-energized';
		} else if (p == 1) //不重要（绿色）
		{
			$scope.classname = 'checkbox-balanced';
		} else //没有（灰色）
		{
			$scope.classname = 'checkbox-stable';
		}
		nonePopover();
	}


	//保存添加新数据
	$scope.saveOneTodo = function() {


		

		$scope.task_title = document.getElementById("taskTitle").value;
		$scope.task_detail = document.getElementById("taskDetail").value;
		

		// 点击条目进入详情页todoid(更新数据)
		if (typeof(todoid) != "undefined" && todoid != "") {
			TodoListService.updateTaskItem(todoid, $scope.task_groupid, $scope.priority_level, $scope.classname, $scope.task_title, $scope.todo_date, $scope.task_detail, $scope.images_list, $scope.name, $scope.recordPath, $scope.done_date);
		} else { // 点击添加数据按钮（添加数据）
			//如果用户名为空，从本地存储取出
		    if (typeof($scope.name) == "undefined" || $scope.name == "") {
			   $scope.name = window.localStorage['userName']
		    }
			$scope.todo_date = (new Date()).Format("yyyy-MM-dd hh:mm:ss");
			TodoListService.addOneTodo($scope.task_id, $scope.task_groupid, $scope.priority_level, $scope.classname, $scope.task_title, $scope.todo_date, $scope.task_detail, $scope.images_list, $scope.name, $scope.recordPath, $scope.done_date);
		}
//		alert($scope.images_list[0]);
//		var avFile = AV.File.withURL('test.jpg', $scope.images_list[0]);
//avFile.save().then(function() {
//	alert("success");
//// The file has been saved to AV.
//}, function(error) {
//	alert("fail");
//// The file either could not be read, or could not be saved to AV.
//});

//      //保存数据到服务端
//		var data = {
//			id: $scope.task_id,
//			groupId: $scope.task_groupid,
//			importance: $scope.priority_level,
//			classname: $scope.classname,
//			title: $scope.task_title,
//			date: $scope.todo_date,
//			detail: $scope.task_detail,
//			images: $scope.images_list,
//			name: $scope.name,
//			record: $scope.recordPath,
//			donedate: $scope.done_date
//		}
//
//		$http({
//			method: 'POST',
//			url: 'http://localhost:3000',
//			params: {
//				'require': data
//			}
//
//		}).success(function(data, status, headers, config) {
//
//		}).error(function(data, status, headers, config) {
//
//		});


        var Requires = AV.Object.extend("Requires");
        var require = new Requires();
        // 点击条目进入详情页todoid(更新数据)
		if (typeof(todoid) != "undefined" && todoid != "") {
			    $ionicLoading.show({
                    template: 'Loading...'
                });
			    var query = new AV.Query(Requires);
				query.equalTo("requireId", parseInt(todoid));
				query.find({
					success: function(results) {
						$ionicLoading.hide();
						var object = results[0];
						
                        object.set("groupId", $scope.task_groupid);
                        object.set("importance", $scope.priority_level);
                        object.set("classname", $scope.classname);
                        object.set("title", $scope.task_title);
            
                        object.set("detail", $scope.task_detail);
                        object.set("images", $scope.images_list);
          
                        object.set("record", $scope.recordPath);
                        object.set("donedate", $scope.done_date);
                        object.save();
                        $cordovaToast.show('更新成功', 'long', 'bottom');
					},
					error: function(error) {
						$cordovaToast.show('更新失败', 'long', 'bottom');
						$ionicLoading.hide();
						alert("Error: " + error.code + " " + error.message);
					}
				});
			
			
		} else { // 点击添加数据按钮（添加数据）
			$ionicLoading.show({
                    template: 'Loading...'
            });
			require.set("requireId", $scope.task_id);
            require.set("groupId", $scope.task_groupid);
            require.set("importance", $scope.priority_level);
            require.set("classname", $scope.classname);
            require.set("title", $scope.task_title);
            require.set("date", $scope.todo_date);
            require.set("detail", $scope.task_detail);
            require.set("images", $scope.images_list);
            require.set("name", $scope.name);
            require.set("record", $scope.recordPath);
            require.set("donedate", $scope.done_date);
            
            require.save(null, {
            success: function(object) {
            $ionicLoading.hide();
            $cordovaToast.show('添加成功', 'long', 'bottom');
                
             },
            error: function(object, error) {
            $ionicLoading.hide();
            // Execute any logic that should take place if the save fails.
            // error is a AV.Error with an error code and description.
            $cordovaToast.show('添加失败'+ 'Failed to create new object, with error code: ' + error.description, 'long', 'bottom');
            }
           });

		}
		

		$state.go('app.todolist', {
			groupId: $scope.task_groupid
		});
	}

	$scope.openRecord = function() {

			$cordovaFileOpener2.open(
				$scope.recordPath,
				'audio/*'
			).then(function() {
				// file opened successfully
			}, function(err) {
				// An error occurred. Show a message to the user
			});

			//     $cordovaFileOpener2.open(
			//  'storage/emulated/0/2a.mp3', 
			//  'audio/*'
			//).then(function() {
			//    // Success!
			//}, function(err) {
			//    // An error occurred. Show a message to the user
			//});

		}
		//设置截止时间
	$scope.deadline = function() {

		var options = {
			date: new Date(),
			mode: 'date', // or 'time'
			minDate: new Date() - 10000,
			allowOldDates: false,
			allowFutureDates: true,
			doneButtonLabel: 'DONE',
			doneButtonColor: '#F2F3F4',
			cancelButtonLabel: 'CANCEL',
			cancelButtonColor: '#000000'
		};

		//权限不为3并且是待确认才可以改变完成时间

		if ($scope.authority != 3 && $scope.task_groupid == 1) {
			$cordovaDatePicker.show(options).then(function(date) {
				$scope.done_date = date.Format("yyyy-MM-dd");

			});
		}

	}

})


// *******************
// 添加列表页面
// *******************
.controller('GroupCtrl', function($scope, $stateParams) {})

// *******************
// 列表一览页面
// *******************
.controller('GrouplistCtrl', function($scope, $state, MenuService) {


	// 显示所有列表
	var findDisplayMenus = function() {
		MenuService.findAll().then(function(menus) {
			$scope.menus = menus;
			alert("GrouplistCtrl");
		});
	}
	findDisplayMenus();

	// "删除列表"Event
	$scope.moveItem = function(item, fromIndex, toIndex) {
		$scope.items.splice(fromIndex, 1);
		$scope.items.splice(toIndex, 0, item);
	};

})

// *******************
// 设置页面
// *******************
.controller('SettingsCtrl', function($scope, $state, $stateParams,$cordovaDialogs) {

	$scope.showAbout = false;
	$scope.showBgcolor = false;

	// "设置背景"Event
	$scope.setBgcolor = function(index) {
		alert(index);
	}
	$scope.loginOut = function(){
		$cordovaDialogs.confirm('是否确认退出程序', '退出确认', ['取消', '确认'])
			.then(function(buttonIndex) {
				// no button = 0, 'OK' = 1, 'Cancel' = 2
				var btnIndex = buttonIndex;

				if (btnIndex == 2) {
					$state.go('sign', {});
				} else {

				}

			});
		
	}

})