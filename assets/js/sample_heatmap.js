var numPoints = 1500,
size = 300,
numRows = 16,
numCols = 16,
showingScatter = true,
scatterDirty = false,
data = null,
cells = null,
color = d3.interpolateRgb("#fff", "#c09");

var getEmptyCells = function() {
  var emptyCells = [];
  for (var rowNum = 0; rowNum < numRows; rowNum++) {
    emptyCells.push([]);
    var row = emptyCells[emptyCells.length - 1];
    for (var colNum = 0; colNum < numCols; colNum++) {
      row.push({
        row: rowNum,
        col: colNum,
        density: 0,
        points: []
      });
    }
  }
  return emptyCells;
};

var clearCells = function() {
  for (var rowNum = 0; rowNum < numRows; rowNum++) {
    for (var colNum = 0; colNum < numCols; colNum++) {
      cells[rowNum][colNum].density = 0;
      cells[rowNum][colNum].points = [];
    }
  }
};

var randomizeData = function() {
  data = [];

  if (cells === null) {
    cells = getEmptyCells();
  }
  else {
    clearCells();
  }

  var x, y, col, row;
  for (var i = 0; i < numPoints; i++) {
    x = Math.random() * size;
    y = Math.random() * size;
    col = Math.min(Math.floor(x / size * numCols), numCols - 1);
    row = Math.min(Math.floor(y / size * numRows), numRows - 1);

    data.push({
      x: x,
      y: y,
      col: col,
      row: row,
      cell: cells[row][col],
      ind: i
    });

    cells[row][col].points.push(data[data.length - 1]);
  }
};

var selectPoints = function(points) {
  d3.selectAll(points).attr("r", 4).attr("stroke", "#f00").attr("stroke-width", 3);

  for (var i = 0; i < points.length; i++) {
    points[i].parentNode.appendChild(points[i]);
  }
};

var deselectPoints = function(points) {
  d3.selectAll(points).attr("r", 2).attr("stroke", "none");
};

var selectCell = function(cell) {
  d3.select(cell).attr("stroke", "#f00").attr("stroke-width", 3);

  cell.parentNode.parentNode.appendChild(cell.parentNode);
  cell.parentNode.appendChild(cell);
};

var deselectCell = function(cell) {
  d3.select(cell).attr("stroke", "#fff").attr("stroke-width", 1);
};

var onPointOver = function(point, data) {
  selectPoints([point]);
  var cell = d3.select("div#heatchart").select('[cell="r' + data.row + 'c' + data.col + '"]');
  selectCell(cell.node());
};

var onPointOut = function(point, data) {
  deselectPoints([point]);
  var cell = d3.select("div#heatchart").select('[cell="r' + data.row + 'c' + data.col + '"]');
  deselectCell(cell.node());
};

var createScatterplot = function() {
  var scatterplot = d3.select("div#scatterplot").append("svg:svg").attr("width", size).attr("height", size);

  scatterplot.selectAll("circle").data(data).enter().append("svg:circle").attr("cx", function(d, i) {
    return d.x;
  }).attr("cy", function(d, i) {
    return d.y;
  }).attr("r", 2).attr("ind", function(d) {
    return d.ind;
  }).on("mouseover", function(d) {
    onPointOver(this, d);
  }).on("mouseout", function(d) {
    onPointOut(this, d);
  });
};

var onCellOver = function(cell, data) {
  selectCell(cell);

  if (showingScatter) {
    var pointEls = [];

    for (var i = 0; i < data.points.length; i++) {
      pointEls.push(d3.select("div#scatterplot").select('[ind="' + data.points[i].ind + '"]').node());
    }

    selectPoints(pointEls);
  }
};

var onCellOut = function(cell, data) {
  deselectCell(cell);

  if (showingScatter) {
    var pointEls = [];

    for (var i = 0; i < data.points.length; i++) {
      pointEls.push(d3.select("div#scatterplot").select('[ind="' + data.points[i].ind + '"]').node());
    }

    deselectPoints(pointEls);
  }
};

var updateScatterplot = function() {
  // select
  var dots = d3.select("div#scatterplot").select("svg").selectAll("circle").data(data);

  // enter
  dots.enter().append("svg:circle").attr("cx", function(d, i) {
    return d.x;
  }).attr("cy", function(d, i) {
    return d.y;
  }).attr("r", 2).attr("ind", function(d) {
    return d.ind;
  }).on("mouseover", function(d) {
    onPointOver(this, d);
  }).on("mouseout", function(d) {
    onPointOut(this, d);
  });

  // update
  dots.attr("cx", function(d, i) {
    return d.x;
  }).attr("cy", function(d, i) {
    return d.y;
  }).attr("ind", function(d) {
    return d.ind;
  }).on("mouseover", function(d) {
    onPointOver(this, d);
  }).on("mouseout", function(d) {
    onPointOut(this, d);
  });

  // exit
  dots.exit().remove();
};

var createHeatchart = function() {
  var min = 999;
  var max = -999;
  var l;

  for (var rowNum = 0; rowNum < cells.length; rowNum++) {
    for (var colNum = 0; colNum < numCols; colNum++) {
      l = cells[rowNum][colNum].points.length;

      if (l > max) {
        max = l;
      }
      if (l < min) {
        min = l;
      }
    }
  }

  var heatchart = d3.select("div#heatchart").append("svg:svg").attr("width", size).attr("height", size);

  heatchart.selectAll("g").data(cells).enter().append("svg:g").selectAll("rect").data(function(d) {
    return d;
  }).enter().append("svg:rect").attr("x", function(d, i) {
    return d.col * (size / numCols);
  }).attr("y", function(d, i) {
    return d.row * (size / numRows);
  }).attr("width", size / numCols).attr("height", size / numRows).attr("fill", function(d, i) {
    return color((d.points.length - min) / (max - min));
  }).attr("stroke", "#fff").attr("cell", function(d) {
    return "r" + d.row + "c" + d.col;
  }).on("mouseover", function(d) {
    onCellOver(this, d);
  }).on("mouseout", function(d) {
    onCellOut(this, d);
  });
};

var updateHeatchart = function() {
  var min = 999;
  var max = -999;
  var l;

  for (var rowNum = 0; rowNum < cells.length; rowNum++) {
    for (var colNum = 0; colNum < numCols; colNum++) {
      l = cells[rowNum][colNum].points.length;

      if (l > max) {
        max = l;
      }
      if (l < min) {
        min = l;
      }
    }
  }

  d3.select("div#heatchart").select("svg").selectAll("g").data(cells).selectAll("rect").data(function(d) {
    return d;
  }).attr("x", function(d, i) {
    return d.col * (size / numCols);
  }).attr("y", function(d, i) {
    return d.row * (size / numRows);
  }).attr("fill", function(d, i) {
    return color((d.points.length - min) / (max - min));
  }).attr("cell", function(d) {
    return "r" + d.row + "c" + d.col;
  }).on("mouseover", function(d) {
    onCellOver(this, d);
  }).on("mouseout", function(d) {
    onCellOut(this, d);
  });
};

var onRandomizeClick = function() {
  randomizeData();

  if (showingScatter) {
    updateScatterplot();
  }
  else {
    scatterDirty = true;
  }

  updateHeatchart();
};

var onNumPointsChange = function(event) {
  numPoints = event.target.options[event.target.selectedIndex].value;
  randomizeData();

  if (showingScatter) {
    updateScatterplot();
  }
  else {
    scatterDirty = true;
  }

  updateHeatchart();
};

var onShowScatterplotChange = function(event) {
  showingScatter = event.target.checked;

  if (showingScatter) {
    if (scatterDirty) {
      updateScatterplot();
      scatterDirty = false;
    }

    d3.select("div#scatterplot").select("svg").attr("visibility", "visible");
  }
  else {
    d3.select("div#scatterplot").select("svg").attr("visibility", "hidden");
  }
};

var init = function() {
  randomizeData();
  createScatterplot();
  createHeatchart();
};

//init();

$(init);
