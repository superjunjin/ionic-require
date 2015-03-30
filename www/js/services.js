angular.module('todo.io.services', [])

.provider('dummyData', function() {
    var menus = [
        { title: '所有需求', badge: 0, groupId: -1},
     
        { title: '待确认', badge: 0, groupId: 1},
        { title: '已确认', badge: 0, groupId: 2},
        { title: '已否决', badge: 0, groupId: 3},
        { title: '已完成', badge: 0, groupId: 4},
        
    ];
    var todos = [];
    var first_todos = 1;
    this.$get = function() {
        return {menus: menus, todos: todos, first_todos:first_todos};
    };
    
})

.factory('MenuService', function ($q, dummyData,localStorageService) {
  return {
    findAll: function () {
        var deferred = $q.defer();
        if(window.localStorage['addMenu'] === "true") {
 
        } else {
	      window.localStorage['addMenu'] = true;
          //首次启动放置菜单数据到本地存储
	      localStorageService.set("menus", dummyData.menus);
        }
        //初始化数据，从本地存储取出菜单数据
        dummyData.menus = localStorageService.get("menus");
        //首次菜单数据绑定（内存的菜单数组和要显示的菜单list）
        var results = dummyData.menus;
       
        deferred.resolve(results);
        return deferred.promise;
    },
    findGroupName: function(groupId) {
        var deferred = $q.defer();
        var results = dummyData.menus.filter(function(element) {
            return parseInt(groupId) === element.groupId;
        });
        deferred.resolve(results);
        return deferred.promise;
    }
  }
})
//status  1,未完成   2,已完成
.factory('TodoListService', function ($q, dummyData,localStorageService) {
    return {
        findByGroupId: function (groupId, sortKey) {
        	var deferred = $q.defer();
        	
            if(dummyData.first_todos==1){
            	
                 //首次启动绑定需求数据
	             var todoss = [];
                 var lsKeys = localStorageService.keys();
                 for(var i in lsKeys)
                {
            	    var task = localStorageService.get(lsKeys[i]);
            	    if(task.date!=undefined)
            	   {
            		   todoss.push(task);
            	   }
                }
                dummyData.todos = todoss; 
                dummyData.first_todos++;
              
            }
	          
        
            
            if(groupId == -1){//所有需求
            	
            	var results = dummyData.todos;
            }else{//各类别需求
            	
            	var results = dummyData.todos.filter(function(element) {
              
 
                return parseInt(groupId) === element.groupId 
                        
            });
            }
            
            
            
//          var results = results.sort(function(a, b){
//             switch ( sortKey ) {
//                case "date": 
//                  return a.id < b.id;
//                case "donedate": 
//                  return a.donedate > b.donedate;
//                case "title": 
//                  return a.title > b.title;
//                case "importance": 
//                  return parseInt(b.importance) - parseInt(a.importance);
//                default: 
//
//                  return a.id < b.id;
//             }
//          });
            deferred.resolve(results);
            return deferred.promise;
        },
        findByTitle: function (titleKey) {
            var deferred = $q.defer();
            var results = dummyData.todos.filter(function(element) {
                return element.title.indexOf(titleKey) == -1 ? false : true;
            });
            deferred.resolve(results);
            return deferred.promise;
        },
        addOneTodo: function(taskId,taskGroupId,taskImportance,taskClassname,taskTitle,taskDate,taskDetail,taskImages,taskName,taskRecord,taskDoneDate){
        	//需求项内存增加
            dummyData.todos.push({requireId: taskId, groupId: taskGroupId, importance: taskImportance, classname:taskClassname, title: taskTitle, date: taskDate, detail: taskDetail,images:taskImages,name:taskName,record:taskRecord,donedate:taskDoneDate});
            //需求项存本地
            localStorageService.set(taskId,{requireId: taskId, groupId: taskGroupId, importance: taskImportance, classname:taskClassname, title: taskTitle, date: taskDate, detail: taskDetail,images:taskImages,name:taskName,record:taskRecord,donedate:taskDoneDate});
            //菜单内存变化（所有的，待确认加1）
            dummyData.menus[0].badge = dummyData.menus[0].badge+1;
            if(taskGroupId!=-1)
            {
            	dummyData.menus[taskGroupId].badge = dummyData.menus[taskGroupId].badge+1;
            }
            
            //菜单存本地
            localStorageService.set("menus", dummyData.menus);

        },
//      addOneTodo2: function(taskId,taskGroupId,taskImportance,taskClassname,taskTitle,taskDate,taskDetail,taskImages,taskName,taskRecord,taskDoneDate){
//      	//需求项内存增加
//      	var deferred = $q.defer();
//      	var todoss = [];
//          todoss.push({requireId: taskId, groupId: taskGroupId, importance: taskImportance, classname:taskClassname, title: taskTitle, date: taskDate, detail: taskDetail,images:taskImages,name:taskName,record:taskRecord,donedate:taskDoneDate});
//          
//          var results = todoss;
//          deferred.resolve(results);
//          return deferred.promise;
//      },
        //查找需求条目
        findTaskItem:function(todoId) {
            var deferred = $q.defer();
            var results = dummyData.todos.filter(function(element) {
        	   
               return parseInt(todoId) === element.requireId;
            });
            deferred.resolve(results);
            return deferred.promise;
        },
        //更新需求条目（四项）
        updateTaskItem:function(todoid,taskGroupid,taskImportance,taskClassname,taskTitle,taskDate,taskDetail,taskImages,taskName,taskRecord,taskDoneDate) {
            
            for(var i in dummyData.todos){
              if(dummyData.todos[i].requireId==parseInt(todoid)){
                
                //菜单数目：原状态列表-1，新状态列表+1
                dummyData.menus[dummyData.todos[i].groupId].badge = dummyData.menus[dummyData.todos[i].groupId].badge-1;
                dummyData.menus[taskGroupid].badge = dummyData.menus[taskGroupid].badge+1;
                //菜单存本地
                localStorageService.set("menus", dummyData.menus);
                
                dummyData.todos[i].groupId = taskGroupid;
                dummyData.todos[i].importance = taskImportance;
                dummyData.todos[i].classname = taskClassname;
                dummyData.todos[i].title = taskTitle;
                dummyData.todos[i].date = taskDate;
                dummyData.todos[i].detail = taskDetail;
                dummyData.todos[i].images = taskImages;
                dummyData.todos[i].record = taskRecord;
                dummyData.todos[i].donedate = taskDoneDate;
                dummyData.todos[i].name = taskName;
              }
            }
            
            localStorageService.set(todoid,{requireId: parseInt(todoid), groupId: taskGroupid, importance: taskImportance, classname:taskClassname, title: taskTitle, date: taskDate, detail: taskDetail,images: taskImages ,name:taskName, record:taskRecord,donedate:taskDoneDate});
            
        },
        
        
        //删除需求条目
        deleteTaskItem:function(deleteData,groupId){
        	for(var i in deleteData){
        		for(var j in dummyData.todos){
        			if(deleteData[i]==dummyData.todos[j].requireId)
        			{
        				 dummyData.todos.splice(j,1);
        				 localStorageService.remove(deleteData[i]);
        				 dummyData.menus[0].badge = dummyData.menus[0].badge-1;//所有的减一
        				 dummyData.menus[groupId].badge = dummyData.menus[groupId].badge-1;//对应类别的减一
        				 //菜单存本地
                         localStorageService.set("menus", dummyData.menus);
        				 break;
        			}
        		}
             
            }
        	
        	console.log(dummyData.todos);
        	
        },
        //批量更新需求条目状态
        updateTaskItemStatus:function(upData,groupId){
        	for(var i in upData){
        		for(var j in dummyData.todos){
        			if(upData[i]==dummyData.todos[j].requireId)
        			{
        				
        				 dummyData.menus[groupId].badge = dummyData.menus[groupId].badge+1;//新状态加一
        				 dummyData.menus[dummyData.todos[j].groupId].badge = dummyData.menus[dummyData.todos[j].groupId].badge-1;//旧状态减一
        				 //菜单存本地
                         localStorageService.set("menus", dummyData.menus);
        				
        				 dummyData.todos[j].groupId = groupId;
        				 
        				 localStorageService.set(upData[i],dummyData.todos[j]);
        				 
        				
        				 break;
        			}
        		}
             
            }
        	
        },
        //批量更新需求条目的完成时间
        updateTaskItemDate:function(upData,doneDate)
        {
        	for(var i in upData){
        		for(var j in dummyData.todos){
        			if(upData[i]==dummyData.todos[j].requireId)
        			{
        				
        				 dummyData.todos[j].donedate = doneDate;
        				 
        				 localStorageService.set(upData[i],dummyData.todos[j]);
        				 
        				 break;
        			}
        		}
             
            }
        },
        //清空并添加新数据
        deleteAndAddTask:function(newtodos)
        { 
        	console.log(dummyData.todos);
        	console.log("---------------------------");
        	//删除所有的需求数据
        	for(var i in dummyData.todos){
        		localStorageService.remove(dummyData.todos[i].requireId);
        	}
        	//删除菜单数据       	
        	for(var m in dummyData.menus){
        		dummyData.menus[m].badge = 0;
        	}
        	localStorageService.set("menus", dummyData.menus);
        	//添加从服务端获取的数据
        	dummyData.todos = newtodos; 
        	console.log(dummyData.todos); 
        	for(var j in dummyData.todos){
        		localStorageService.set(dummyData.todos[j].requireId,dummyData.todos[j]);
        	}
        	
        	//添加菜单数据
        	for(var k in dummyData.todos){
        		
        		var groupid = dummyData.todos[k].groupId
        		dummyData.menus[groupid].badge +=1;
        		dummyData.menus[0].badge +=1 
      		
        	}
        	localStorageService.set("menus", dummyData.menus);
        	
        	
        }
        
    }
})