// db.tasks.find().sort({priority:1,state:1}).limit(2);
// db.tasks.find().sort({priority:1,state:1}).skip(2).limit(2);
// skip 先查询出完整的结果集，再定位到要跳过的最后一个文档的位置
//  将之前查询到的文档集中的最后一个文档索引保存起来，作为下一次查询时的查找条件，为了减少查询时的文档集数量
// 尽量使用排序的键作为查询的筛选条件，为了提高效率，便于用比较运算符筛选，排序的键应该尽量唯一
// var cursor = db.tasks.find({taskId:{$gt:lastId}}).sort({taskId:1}).limit(2);  //升序
// var lastId;
// //$gt $each 等都是操作符
// //push都是选择器
// cursor.forEach((t)=>{
//     print(t.taskId);
//     lastId = t.taskId;
// });
// var products = db.products.find().toArray();  //将游标转化为数组
// for(var p of products) {
//     p.random = Math.random();
// }
// db.products.drop();
// db.products.insert(products);
//
// var r  = Math.random();
// var rp = db.products.findOne({random:{$gt:r}});
// if(rp==null) {
//     rp = db.products.findOne({random:{$lt:r}});
// }
// print(rp); //返回匹配到的那个文档对象
//
//
//
//
//
// 不是将find发送到服务器，而是将最后产生的查询文档发送到服务器
// //手动附加其他高级查询选项
// _addSpecial（选项名，值）
// $maxScan 查询效率高，但很可能不完整
// $limit 扫描全部文档
// $skip  查询全部文档
//
// $min $max 与 $gt $lt
// 但是$min $max的值(对象)必须要求键上有索引
// db.products.find({count:{$gt:30,$lt:50}})_addSpecial("$maxScan",2);
//
// 在要查询的键上建立索引
// db.products.ensureIndex({count:1});  //在count键上建立升序索引
// db.products.find().addSpecial("$min",{count:30})._addSpecial("$max",{count:50});
// db.products.find().min({count:10}).max({count:40});
// 服务器何时释放游标
// 1 游标完成迭代查询结果
// 2 在客户端内，游标释放，会向服务器发送消息，释放服务器端有效
// 3 10分钟内没有操作，自动释放
// 特例： 可用客户端的immortal延长游标的生命周期
// db.product.drop();
// db.runCommand("drop","product");
// 索引是一个集合，连续存储，查找速度极快
// 而全表扫描,服务器必须遍历所有文档，然后将每个文档和查询条件比较，效率低
// 单键索引——只使用一个键建立的索引
// db.products.ensureIndex({键：1});
// explain("executionStats");
// var arr = [];
// for(var i=0;i<100000;i++) {
//     arr[i] = {
//         sid:(100000+i).slice(1)
//         score:90
//     };
// }
// db.exam.insert(arr);
// db.exam.ensureIndex({sid:1}); //建立索引
// 索引文件名 键_名
// db.exam.dropIndex("sid_1");
// db.exam.find().sort({sid:1});
// 索引是独立存储
// 复合索引：查询中索引会缩小查询文档范围
// 而排序不同，如果放在后面就没有效果
//
//
//
//
//
//
//
//
//
//
//
