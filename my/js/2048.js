var game;
var tileSize = 100;
window.onload = function(){
    
    var config = {
        type: Phaser.AUTO,		//Phaser.CANVAS  Phaser.WEBGL
        backgroundColor: 0x222222,
        width: tileSize * 4,
        height: tileSize * 4,
        parent: "gameDiv",    
        scene: playGame
    };
    game = new Phaser.Game(config);
    window.focus();	
}

var fieldArray = new Array(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);				
var colors = {
    2: '#FFFFFF',
    4: '#FFEEEE',
    8: '#FFDDDD',
    16: '#FFCCCC',
    32: '#FFBBBB',
    64: '#FFAAAA',
    128: '#FF9999',
    256: '#FF8888',
    512: '#FF7777',
    1024: '#FF6666',
    2048: '#FF5555',
    4096: '#FF4444',
    8192: '#FF3333',
    16384: '#FF2222',
    32768: '#FF1111',
    65536: '#FF0000'
}
var canMove = false;
class playGame extends Phaser.Scene {
    
    constructor(){
        super("PlayGame");
    }
    
    preload(){
        this.load.image("tile", "/my/images/tile.png");
    }
    
    create(){
        var me = this;
        this.input.on('pointermove', function(pointer, currentlyOver){
            var curPosition = pointer.position;
            var prePosition = pointer.prevPosition;
            
            if(me.moving == true) return;
            
            if(curPosition.x - prePosition.x < -20){
                me.moveLeft()	
            } else if(curPosition.y - prePosition.y > 20){
                me.moveDown();				
            } else if(curPosition.y - prePosition.y < -20){
                me.moveUp();				
            } else if(curPosition.x - prePosition.x > 20){
                me.moveRight();				
            } 
        });
        
        this.tileSprites = this.add.group();
        
        this.addTwo();
        this.addTwo();
        
        this.moving = false;
    }
    
    sortByXY(spriteArr, xy, flag){
        console.log("sort: " + spriteArr.length);
        
        var newSprites = Phaser.Utils.Array.StableSort(spriteArr, function(container1, container2){
            if(flag == "asc") {
                if(container1[xy] < container2[xy]) {
                    return -1;
                }		 	
                return 1;
            } else {
                if(container1[xy] > container2[xy]) {
                    return -1;
                }
                
                return 1;
            }
            
        });
        
        return newSprites;
    }
    
    //右移
    moveRight(){
        var me = this;
        var sprites = this.tileSprites.getChildren();
        
        var newSprites = me.sortByXY(sprites, 'x', 'desc');
        
        var isDel = false;
        newSprites.forEach(function(sprite){
            var pos = sprite.pos;
            var row = me.toRow(pos);
            var _col = me.toCol(pos);
            var _val = fieldArray[pos];			
            
            var col = _col;
            while(col < 3){
                col++;
                var num = me.toNum(row, col);
                
                var checked = me.checkSprite(sprite, num);
                if(checked > 0){
                    if(checked == 1) {
                        col--;
                    }
                    break;	
                }
            }
            
            fieldArray[pos] = 0
            sprite.pos = me.toNum(row, col);				
            if(!sprite.del) {
                fieldArray[sprite.pos] = _val;
            }
            me.moving = true;
            var move = me.tweens.add({
                targets: [ sprite ],			
                x: { value: col * tileSize, duration: 500, ease: 'Power1' },
                onComplete: function(){
                    if(sprite.del) {						
                        sprite.destroy()
                    }
                    me.moving = false;
                    me.updateNumbers();
                }
            });
        });
        
        this.addNewTwo()
        
    }
    
    //上移
    moveUp(){
        var me = this;
        var sprites = this.tileSprites.getChildren();
        
        var newSprites = me.sortByXY(sprites, 'y', 'asc');		
        
        var isDel = false;
        newSprites.forEach(function(sprite){
            var pos = sprite.pos;
            var _row = me.toRow(pos);
            var col = me.toCol(pos);
            var _val = fieldArray[pos];
                        
            var row = _row;
            while(row > 0){
                row--;
                var num = me.toNum(row, col);
                
                var checked = me.checkSprite(sprite, num);
                if(checked > 0){
                    if(checked == 1) {
                        row++;
                    }
                    break;	
                }
            }
            
            fieldArray[pos] = 0
            sprite.pos = me.toNum(row, col);				
            if(!sprite.del) {
                fieldArray[sprite.pos] = _val;
            }
            me.moving = true;
            var move = me.tweens.add({
                targets: [ sprite ],			
                y: { value: row * tileSize, duration: 500, ease: 'Power1' },
                onComplete: function(){
                    if(sprite.del) {						
                        sprite.destroy()
                    }
                    me.moving = false;
                    me.updateNumbers();
                }
            });
        });
        
        this.addNewTwo();
        
    }
    
    //下移
    moveDown(){
        var me = this;
        var sprites = this.tileSprites.getChildren();
        
        var newSprites = me.sortByXY(sprites, 'y', 'desc');		
        
        var isDel = false;
        newSprites.forEach(function(sprite){
            var pos = sprite.pos;
            var _row = me.toRow(pos);
            var col = me.toCol(pos);
            var _val = fieldArray[pos];
                        
            var row = _row;
            while(row < 3){
                row++;
                var num = me.toNum(row, col);
                
                var checked = me.checkSprite(sprite, num);
                if(checked > 0){
                    if(checked == 1) {
                        row--;
                    }
                    break;	
                }
            }
            
            fieldArray[pos] = 0
            sprite.pos = me.toNum(row, col);
            if(!sprite.del) {
                fieldArray[sprite.pos] = _val;
            }
            me.moving = true;
            var move = me.tweens.add({
                targets: [ sprite ],			
                y: { value: row * tileSize, duration: 500, ease: 'Power1' },
                onComplete: function(){
                    if(sprite.del) {						
                        sprite.destroy()
                    }
                    me.moving = false;
                    me.updateNumbers();
                }
            });
        });
        
        this.addNewTwo();

    }
    
    //左移
    moveLeft(){
        var me = this;
        var sprites = this.tileSprites.getChildren();		
        var newSprites = me.sortByXY(sprites, 'x', 'asc');
        
        newSprites.forEach(function(sprite){
            var pos = sprite.pos;
            var row = me.toRow(pos);
            var col = me.toCol(pos);
            var _val = fieldArray[pos];
                                    
            while(col > 0){
                col--
                var num = me.toNum(row, col);
                
                var checked = me.checkSprite(sprite, num);
                if(checked > 0){
                    if(checked == 1) {
                        col++;
                    }
                    break;	
                }
            }
            
            fieldArray[pos] = 0;
            sprite.pos = me.toNum(row, col);
            if(!sprite.del) {								
                fieldArray[sprite.pos] = _val;
            }
            
            me.moving = true;
            var move = me.tweens.add({
                targets: [ sprite ],			
                x: { value: col * tileSize, duration: 500, ease: 'Power1' },
                onComplete: function(){
                    if(sprite.del) {						
                        sprite.destroy()
                    }
                    
                    me.moving = false;					
                    me.updateNumbers();
                }
            });
        });
                
        this.addNewTwo();		
    }
    
    checkSprite(sprite, num, pos){		
        var flag = 0;
        var pos = sprite.pos;
        //前方有障碍
        if(fieldArray[num] != 0 && fieldArray[num] != fieldArray[pos]){					
            flag = 1;
        } else if(fieldArray[num] != 0 && fieldArray[num] == fieldArray[pos]){
            fieldArray[num] *= 2;					
            sprite.del = true;			
            flag = 2;
        }
        
        return flag;
    }
    
    addNewTwo(){
        this.addTwo();
        this.addTwo();
    }
    
    addTwo(){
        var isFull = true;
        fieldArray.forEach(function(item){
            if(item == 0) isFull = false;
        });
        
        if(isFull) {
            alert("over");
            return;
        }
        
        do{
            var randomValue = Math.floor(Math.random()*16);
        } while (fieldArray[randomValue]!=0)
        
        fieldArray[randomValue] = 2;
        var x = this.toCol(randomValue)*tileSize;
        var y = this.toRow(randomValue)*tileSize;
        
        var tile = this.add.sprite(0, 0, "tile");
        tile.alpha = 0.5;
        tile.setOrigin(0, 0);
        tile.pos = randomValue;
        
        var text = this.add.text( tileSize/2, tileSize/2,"2",{font:"bold 16px Arial",align:"center"});
        text.setOrigin(0.5, 0.5);
        text.setColor(colors[fieldArray[randomValue]])
        
        var container = this.add.container(x, y, [tile, text]);

        container.pos = randomValue;
        
        this.tileSprites.add(container);
        
//		var fadeIn = this.tweens.add({
//			targets: [ container ],			
//	        alpha: { value: 1, duration: 5000, ease: 'Power1' }		
//		});
    }
    
    // GIVING A NUMBER IN A 1-DIMENSION ARRAY, RETURNS THE ROW
    toRow(n){
        return Math.floor(n/4);
    }
    
    // GIVING A NUMBER IN A 1-DIMENSION ARRAY, RETURNS THE COLUMN
    toCol(n){
        return n%4;	
    }
    
    toNum(row, col){
        return row * 4 + col;	
    }
    
    updateNumbers(){
        var sprites = this.tileSprites.getChildren();
        
        sprites.forEach(function(item){			
            var value = fieldArray[item.pos];			
            item.getAt(1).setText(value);
            item.getAt(1).setColor(colors[value])
        });	
    }
}