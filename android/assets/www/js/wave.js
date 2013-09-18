var sxyz = 5, //摇动开始精度
	fxyz = 3, //摇动结束精度
	lastNUm = 6 //在精度内多少个点算做结束

var wave = function(data, collection, sender){
	var collection = collection || [];
    collection.push(data);

    /*处理摇动是否开始*/
    if(2 == collection.length){
        if((Math.abs(data.x - collection[0].x) < sxyz) 
        	&& (Math.abs(data.y - collection[0].y) < sxyz) 
        	&& (Math.abs(data.z - collection[0].z) < sxyz))
        {
            collection.shift();
        }
    }

    /*判断摇动结束*/
	if(collection.length < 3){
        return false;
    }
    var lastDot = collection.slice(-lastNUm),
    	lx = [],
    	ly = [],
    	lz = [];
    lastDot.forEach(function(i){
    	lx.push(i.x);
    	ly.push(i.y);
    	lz.push(i.z);
    });
    if( Math.max.apply(null, lx) - Math.min.apply(null, lx) > fxyz
     || Math.max.apply(null, ly) - Math.min.apply(null, lz) > fxyz
     || Math.max.apply(null, lz) - Math.min.apply(null, lz) > fxyz)
    {
        return false;
    }

    if(SensorMonitor.isUserSetup){
    	return collection;
    }
    return true;
}