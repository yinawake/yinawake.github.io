var graph = new joint.dia.Graph;
	
var paper = new joint.dia.Paper({
    el: document.getElementById('paper-multiple-papers'),
    // el: document.getElementById('myholder'),
    model: graph,
    width: 600,
    height: 100,
    gridSize: 1,
    background: {
        color: 'rgba(0, 255, 0, 0.3)'
    }
});

var paperSmall = new joint.dia.Paper({
    el: document.getElementById('paper-multiple-papers-small'),
    model: graph,
    width: 150,
    height: 25,
    gridSize: 1,
    interactive: false
});
paperSmall.scale(0.25);

/* paper.scale(0.5, 0.5);
paper.translate(300, 50); */

var rect = new joint.shapes.standard.Rectangle();
rect.position(100, 30);
rect.resize(100, 40);
rect.attr({
    body: {
        fill: 'blue'
    },
    label: {
        text: 'hello',
        fill: 'white'
    }
});

rect.addTo(graph);

var rect2 = rect.clone();
rect2.translate(300, 0);
rect2.attr('label/text', 'world!');
rect2.addTo(graph);

var link = new joint.shapes.standard.Link();
link.source(rect);
link.target(rect2);
link.addTo(graph);