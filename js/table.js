var tabulate = function (data,columns) {

 var table = d3.select('#bottom').append('table').attr('class','datatable')
	var thead = table.append('thead')
	var tbody = table.append('tbody')

	thead.append('tr')
	  .selectAll('th')
	    .data(columns)
	    .enter()
	  .append('th')
	    .text(function (d) { return d })

	var rows = tbody.selectAll('tr')
	    .data(data)
	    .enter()
	  .append('tr')

	var cells = rows.selectAll('td')
	    .data(function(row) {
	    	return columns.map(function (column) {
	    		return { column: column, value: row[column] }
	      })
      })
      .enter()
    .append('td').attr("class","datatd")
      .text(function (d) { return d.value })


  return table;

  
}

d3.select('#bottom').html("<br/>")
d3.csv('data/Calais.csv',function (data) {
	var columns = ['name','age','year','cause','nationality']
  tabulate(data,columns)
 d3.select('#bottom').append('div').attr("id","footnote").html("<br/><a href='data/Calais.csv' download>Télécharger les données</a><br/><br/>")
})

