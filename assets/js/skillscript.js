// Full data set
const allData = [
    { text: "Apple", category: "Category A" },
    { text: "Banana", category: "Category B" },
    { text: "Carrot", category: "Category C" },
    { text: "Dragonfruit", category: "Category D" },
    { text: "Eggplant", category: "Category E" },
    { text: "Avocado", category: "Category A" },
    { text: "Blueberry", category: "Category B" },
    { text: "Cucumber", category: "Category C" },
    { text: "Date", category: "Category D" },
    { text: "Endive", category: "Category E" },
    { text: "Apricot", category: "Category A" },
    { text: "Broccoli", category: "Category B" },
    { text: "Celery", category: "Category C" },
    { text: "Durian", category: "Category D" },
    { text: "Elderberry", category: "Category E" },
];

const svg = d3.select("#viz");
const width = svg.node().clientWidth;
const height = svg.node().clientHeight;

let simulation;
let nodeGroup;

// Color scale
const color = d3.scaleOrdinal()
    .domain(["Category A", "Category B", "Category C", "Category D", "Category E"])
    .range(d3.schemeSet2);

// Initial render
update(getSelectedCategories());

d3.selectAll("#checkboxes input").on("change", () => {
    update(getSelectedCategories());
});

function getSelectedCategories() {
    return Array.from(document.querySelectorAll("#checkboxes input:checked"))
        .map(cb => cb.value);
}

function update(selectedCategories) {
    const filteredData = allData.filter(d => selectedCategories.includes(d.category));

    if (simulation) simulation.stop();

    // Bind data
    nodeGroup = svg.selectAll("g.node")
        .data(filteredData, d => d.text);

    // EXIT
    nodeGroup.exit()
        .transition()
        .duration(500)
        .style("opacity", 0)
        .remove();

    // ENTER
    const enterGroup = nodeGroup.enter()
        .append("g")
        .attr("class", d => "node " + d.category.replace(/\s/g, ''))
        .style("opacity", 0);

    enterGroup.append("circle")
        .attr("r", 30)
        .attr("fill", d => color(d.category))
        .attr("stroke", "#333")
        .attr("stroke-width", 1.5);

    enterGroup.append("text")
        .text(d => d.text)
        .attr("text-anchor", "middle")
        .attr("dy", 4)
        .attr("font-size", "12px")
        .attr("fill", "#000");

    enterGroup.transition()
        .duration(500)
        .style("opacity", 1);

    nodeGroup = enterGroup.merge(nodeGroup);

    // Simulation
    simulation = d3.forceSimulation(filteredData)
        .force("charge", d3.forceManyBody().strength(-10))
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collision", d3.forceCollide().radius(35))
        .force("x", d3.forceX(width / 2).strength(0.05))
        .force("y", d3.forceY(height / 2).strength(0.05))
        .on("tick", () => {
            nodeGroup.attr("transform", d => {
                d.x = Math.max(30, Math.min(width - 30, d.x));
                d.y = Math.max(30, Math.min(height - 30, d.y));
                return `translate(${d.x},${d.y})`;
            });
        });
}
