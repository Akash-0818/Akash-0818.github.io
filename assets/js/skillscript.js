// Full data set
const allData = [
    // { text: "Apple", category: "Category A" },
    // { text: "Banana", category: "Category B" },
    // { text: "Carrot", category: "Category C" },
    // { text: "Dragonfruit", category: "Category D" },
    // { text: "Eggplant", category: "Category E" },
    // { text: "Avocado", category: "Category A" },
    // { text: "Blueberry", category: "Category B" },
    // { text: "Cucumber", category: "Category C" },
    // { text: "Date", category: "Category D" },
    // { text: "Endive", category: "Category E" },
    // { text: "Apricot", category: "Category A" },
    // { text: "Broccoli", category: "Category B" },
    // { text: "Celery", category: "Category C" },
    // { text: "Durian", category: "Category D" },
    // { text: "Elderberry", category: "Category E" },
    { text: "Tensorflow", category: "C1"},
    { text: "Keras", category: "C1"}, 
    { text: "PyTorch", category: "C1"},
    { text: "OpenCV", category: "C1"},
    { text: "Jupyter", category: "C1"},
    { text: "MLflow", category: "C1"},
    { text: "Numpy", category: "C1"},
    { text: "Pandas", category: "C1"},
    { text: "Matplotlib", category: "C1"},
    { text: "Scikit-learn", category: "C1"},
    { text: "SciPy", category: "C1"},
    { text: "Python", category: "C2"},
    { text: "C++", category: "C2"},
    { text: "C#", category: "C2"},
    { text: ".NET Core", category: "C2"},
    { text: ".NET WPF", category: "C2"},
    { text: "ASP.NET", category: "C2"},
    { text: "HTML", category: "C2"},
    { text: "CSS", category: "C2"},
    { text: "JavaScript", category: "C2"},
    { text: "D3.js", category: "C2"},
    { text: "SQL", category: "C3"},
    { text: "PostgreSQL", category: "C3"},
    { text: "MongoDB", category: "C3"},
    { text: "Amazon S3", category: "C3"},
    { text: "Azure SQL", category: "C3"},
    { text: "Apache Cassandra", category: "C3"},
    { text: "Pinecone", category: "C3"},
    { text: "Clickhouse", category: "C3"},
    { text: "Flask", category: "C4"},
    { text: "Django", category: "C4"},
    { text: "REST API", category: "C4"},
    { text: "Git", category: "C4"},
    { text: "CI/CD", category: "C4"},
    { text: "Docker", category: "C4"},
    { text: "Kubernetes", category: "C4"},
    { text: "Kafka", category: "C4"},
    { text: "JIRA", category: "C4"},
    { text: "Snowflake", category: "C4"},
    { text: "Amazon EC2", category: "C5"},
    { text: "Amazon SageMaker", category: "C5"},
    { text: "AWS Lambda", category: "C5"},
    { text: "Azure ML", category: "C5"},
    { text: "Azure DevOps", category: "C5"},
    { text: "Azure Databricks", category: "C5"},
    { text: "Jenkins", category: "C5"},
    { text: "Spark", category: "C6"},
    { text: "Hadoop", category: "C6"},
    { text: "ETL Pipelines", category: "C6"},

    

];

const svg = d3.select("#viz");
const width = svg.node().clientWidth;
const height = svg.node().clientHeight;

let simulation;
let nodeGroup;

// Color scale
const color = d3.scaleOrdinal()
    .domain(["C1", "C2", "C3", "C4", "C5", "C6"])
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
        .attr("r", d => Math.max(d.text.length*2, 30))
        .attr("fill", d => color(d.category))
        .attr("stroke", "#333")
        .attr("stroke-width", 1.5);

    // enterGroup.append("text")
    //     .text(d => d.text)
    //     .attr("text-anchor", "middle")
    //     .attr("dy", 4)
    //     .attr("font-size", "12px")
    //     .attr("fill", "#000");
    enterGroup.append("text")
    .selectAll("tspan")
    .data(d => {
        const words = d.text.split(" ");
        if (words.length > 1) {
            const mid = Math.ceil(words.length / 2);
            return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
        }
        return [d.text]; // fallback for single-word labels
    })
    .enter()
    .append("tspan")
    .attr("x", 0)
    .attr("dy", (d, i) => i === 0 ? 0 : 15)  // shift second line downward
    .attr("text-anchor", "middle")
    .attr("font-size", "13px")
    .text(d => d);

    enterGroup.transition()
        .duration(500)
        .style("opacity", 1);

    nodeGroup = enterGroup.merge(nodeGroup);

    // Simulation
    simulation = d3.forceSimulation(filteredData)
        .force("charge", d3.forceManyBody().strength(-10))
        .force("center", d3.forceCenter(1.2 * (width / 2), height / 2))
        .force("collision", d3.forceCollide().radius(35))
        .force("x", d3.forceX(width / 2).strength(0.05))
        .force("y", d3.forceY(height / 2).strength(0.05))
        // .on("tick", () => {
        //     nodeGroup.attr("transform", d => {
        //         d.x = Math.max(30, Math.min(width - 30, d.x));
        //         d.y = Math.max(30, Math.min(height - 30, d.y));
        //         return `translate(${d.x},${d.y})`;
        //     });
        // });
        .on("tick", () => {
            nodeGroup.attr("transform", d => {
                const r = d.text.length * 2 > 30 ? d.text.length * 2 : 30; // match circle radius logic
        
                // Clamp position within SVG bounds
                d.x = Math.max(r, Math.min(width - r, d.x));
                d.y = Math.max(r, Math.min(height - r, d.y));
        
                return `translate(${d.x},${d.y})`;
            });
        });
}
