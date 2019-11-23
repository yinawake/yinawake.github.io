var graph = new joint.dia.Graph;
	
var paper = new joint.dia.Paper({
    el: document.getElementById('myholder'),
    model: graph,
    width: 600,
    height: 300,
    // gridSize: 1,
    drawGrid: true,
    background: {
        color: 'rgba(0, 255, 0, 0.3)'
    }
});

var rect = new joint.shapes.standard.Rectangle();
rect.position(100, 30);
rect.resize(100, 40);
rect.attr({
    body: {
        fill: 'blue'
    },
    label: {
        text: 'Hello',
        fill: 'white'
    }
});
rect.addTo(graph);

var rect2 = new joint.shapes.standard.Rectangle();
rect2.position(400, 30);
rect2.resize(100, 40);
rect2.attr({
    body: {
        fill: '#2C3E50',
        rx: 5,
        ry: 5,
        strokeWidth: 2
    },
    label: {
        text: 'World',
        fill: '#3498DB',
        fontSize: 18,
        fontWeight: 'blod',
        fontVariant: 'small-caps'
    }
});
rect2.addTo(graph);

var link = new joint.shapes.standard.Link();
link.source(rect);
link.target(rect2);
link.attr({
    line: {
        stroke: 'blue',
        strokeWidth: 1,
        sourceMarker: {
            'type': 'path',
            'stroke': 'black',
            'fill': 'red',
            'd': 'M 10 -5 0 0 10 5 Z'
        },
        targetMarker: {
            'type': 'path',
            'stroke': 'black',
            'fill': 'yellow',
            'd': 'M 10 -5 0 0 10 5 Z'
        }
    }
});
link.labels([{
    attrs: {
        text: {
            text: 'Hello World!'
        }
    }
}]);
link.addTo(graph);

paper.on('blank:pointerdblclick', function(){
    console.log("blank:pointerdblclick");
    this.drawBackground({
        color: 'orange'
    });
});

paper.on('element:pointerdblclick', function(elementView){
    var currentElement = elementView.model;
    currentElement.attr('body/stroke', 'orange');
    console.log('element:pointerdblclick');
});

paper.on('link:pointerdblclick', function(linkView){
    var currentLink = linkView.model;
    currentLink.attr('line/stroke', 'orange');
    console.log('link:pointerdblclick');
});

paper.on('cell:pointerdblclick', function(cellView){

    console.log('cell:pointerdblclick');
});

graph.on('change:position', function(cell){
    var center = cell.getBBox().center();
    var label = center.toString();

    console.log(label + " " + cell.get("attrs").label.text);
});