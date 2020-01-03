export const toSingleArray = (applications) => {
   var list = [];
   for(var key in applications){
      list = list.concat(Object.values(applications[key]).map(function (application) {
         return application;
      }));
   }
   return list;
}