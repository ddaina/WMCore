function(doc) {
   var ele = doc["WMCore.WorkQueue.DataStructs.WorkQueueElement.WorkQueueElement"];
   if (ele['WMBSUrl']) {
       emit(ele['WMBSUrl'], null);
   };
}