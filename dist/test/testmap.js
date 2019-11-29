//1.定义Map
let map = new Map([[1, 'one'], [2, 'two'], [3, 'three']]);
// console.log(map.size);
//2.移除Map对象的所有键值对
// map.clear();
// console.log(map.size);
//3.移除单个键值
// console.log(map.has(1));
// map.delete(1);
// console.log(map.has(1));
//4.通过键获取值
// map.get(2);
// console.log(map.get(2));
// console.log(map.get(4));
//5.keys()函数
// console.log(map.keys());
//6.插入新的键值对
// map.set(4,'four');
// console.log((map.has(4)));
//7.values()函数
// console.log(map.values());
//8.for...of迭代
for (let [key, value] of map.entries()) {
    console.log(key + '...' + value);
}
for (let key of map.keys()) {
    console.log(key);
}
for (let value of map.values()) {
    console.log(value);
}
//# sourceMappingURL=testmap.js.map