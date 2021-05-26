import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from "@angular/core";
import { fromEvent } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { D3Service } from "../../services/d3.service";

@Component({
  selector: "app-line-graph",
  templateUrl: "./line-graph.component.html",
  styleUrls: ["./line-graph.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class LineGraphComponent implements OnInit, AfterViewInit {
  @Input() lineGraphId = "sample_line-graph_id_1";
  @Input() data;
  @Input() width: any = 1920;
  @Input() height: any = 969;
  @Input() keys = ["completed", "inProgress", "notStarted"];
  @Input() dotKeys = [
    "Missing Data",
    "Outlier",
    "Overlapping Events",
    "Variance",
    "Percentage Change Outlier",
    "Multi-Variate Analysis",
    "Cross Domain Anomaly - Missing AEs",
    "Cross Domain Anomaly - Incorrect AEs",
  ];
  public lineGraph = null;
  constructor(private _d3Service: D3Service) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    fromEvent(window, "resize")
      .pipe(debounceTime(200))
      .subscribe(() => {
        if (this.lineGraph) {
          this.lineGraph.resize();
        }
      });
    // this.lineGraph = this.renderLineGraph();
  }

  ngOnChanges(changes: SimpleChanges) {
    // if (!changes.data.firstChange) {
    if (Object.keys(changes.data.currentValue).length > 0) {
      this._d3Service.d3.selection
        .select(`#${this.lineGraphId}`)
        .selectAll("*")
        .remove();
      setTimeout(() => {
        this.lineGraph = this.renderLineGraph();
        setTimeout(() => {
          this.lineGraph.resize();
        }, 0);
      }, 0);
    }
    // }
  }

  renderLineGraph() {
    const d3 = this._d3Service.d3;
    const data = [...this.data.graphData];

    // format the data
    data.forEach(function (d) {
      d.completed = +d.completed;
      d.inProgress = +d.inProgress;
      d.notStarted = +d.notStarted;
    });
    data.unshift({
      name: "",
      completed: 0,
      inProgress: 0,
      notStarted: 0,
    });

    // set the dimensions and margins of the graph
    const margin = { top: 20, right: 10, bottom: 80, left: 30 };
    const width = this.width - margin.left - margin.right;
    const height = this.height - margin.top - margin.bottom;

    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    const svg = this._d3Service.createSvg(
      this.lineGraphId,
      width,
      height,
      margin
    );

    const mainGroup = this._d3Service.createGroup(
      svg,
      "mainGroup",
      ["main-group"],
      { x: margin.left, y: margin.top }
    );

    const tip = d3.tip
      .default()
      .attr("class", "d3-line-graph-tip")
      .offset([-10, 0])
      .html((event, value) => {
        // console.log(value);
        const statusTitle = {
          completed: "Completed",
          inProgress: "In Progress",
          notStarted: "Not Started",
        };
        return `
        <div class="d-flex justify-content-between mb-1">
            <strong>${
              statusTitle[event.target.getAttribute("status")]
            }: </strong> <span>${
          value[event.target.getAttribute("status")]
        }</span>
        </div>
        `;
      });
    svg.call(tip);

    const { resize, heightAspect, widthAspect } = this._d3Service.responsivefy(
      svg,
      true
    );

    // set the ranges
    const x = d3.scale.scalePoint().range([0, width]);
    const y = d3.scale.scaleLinear().range([height, 0]);
    const yGrid = d3.scale.scaleLinear().range([height, 0]);

    const lineColor = d3.scale
      .scaleOrdinal()
      .range(["#77DD6E", "#EDA538", "#888888"])
      .domain(this.keys);

    // Scale the range of the data
    x.domain([
      ...d3.array.map(data, (d) => {
        return d.name;
      }),
      "extra",
    ]);
    y.domain([
      0,
      d3.array.max(data, (d) => {
        return Math.max(d.completed, d.inProgress, d.notStarted);
      }) + 10,
    ]);

    yGrid.domain([
      0,
      d3.array.max(data, (d) => {
        return Math.max(d.completed, d.inProgress, d.notStarted);
      }) + 10,
    ]);

    // Add the X Axis
    mainGroup
      .append("g")
      .classed("x-axis", true)
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axis.axisBottom(x))
      .call((g) => g.select(".domain").remove())
      .call((g) => g.selectAll(".x-axis .tick:last-of-type").remove())
      .selectAll("text")
      .attr("y", 0)
      .attr("x", 20)
      .attr("dy", "0.5em")
      .style("text-anchor", "end")
      .style("font-size", "12px")
      .attr("transform", "translate(0,10) rotate(-45)")
      .text((d) => d)
      .each(function () {
        var text = d3.selection.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")),
          tspan = text
            .text(null)
            .append("tspan")
            .attr("x", 0)
            .attr("y", y)
            .attr("dy", dy + "em");
        while ((word = words.pop())) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > 100) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text
              .append("tspan")
              .attr("x", 0)
              .attr("y", y)
              .attr("dy", `${++lineNumber * lineHeight + dy}em`)
              .text(word);
          }
        }
      });

    if (this.data.xAxisLabel && this.data.xAxisLabel.length > 0) {
      mainGroup
        .selectAll(".x-axis")
        .append("g")
        .append("text")
        .attr("class", "label")
        .attr("y", 0)
        .attr("fill", "#000")
        .attr("x", 0)
        .attr("dy", "-4em")
        .attr("opacity", 1)
        .text(this.data.xAxisLabel)
        .style("font-size", "15px")
        .style("transform", function (d) {
          const text = d3.selection.select(this);
          console.log(text);
          return `translate(${
            (width - text.node().getComputedTextLength()) / 2
          }px, ${(svg.select(".x-axis").node() as any).getBBox().height + 20}px) rotate(0deg)`;
        });
    }

    // Add the Y Axis
    mainGroup
      .append("g")
      .classed("y-axis", true)
      .call(d3.axis.axisLeft(y).ticks(5));

    if (this.data.yAxisLabel && this.data.yAxisLabel.length > 0) {
      mainGroup
        .selectAll(".y-axis")
        .append("g")
        .append("text")
        .attr("class", "label")
        .attr("y", 0)
        .attr("fill", "#000")
        .attr("x", 0)
        .attr("dy", "-4em")
        .attr("opacity", 1)
        .text(this.data.yAxisLabel)
        .style("font-size", "15px")
        .style("transform", function (d) {
          const text = d3.selection.select(this);
          // console.log(text);
          return `translate(0px, ${
            (height - text.node().getComputedTextLength() - margin.bottom) / 2
          }px) rotate(-90deg)`;
        });
    }
    // Add the Y Axis Grid
    mainGroup
      .append("g")
      .classed("y-axis-grid", true)
      .call(d3.axis.axisLeft(yGrid).tickFormat("").tickSize(-width))
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .selectAll(".y-axis-grid .tick:not(:first-of-type) line")
          .attr("stroke-opacity", 0.5)
      );

    // Add the valueline path.
    this.keys.forEach((key) => {
      mainGroup
        .append("path")
        .data([data])
        .style("stroke", lineColor(key))
        .attr("class", "line")
        .attr(
          "d",
          d3.shape
            .line()
            .x((d) => {
              return x(d.name);
            })
            .y((d) => {
              return y(d[key]);
            })
        );

      mainGroup
        .selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("stroke", "none")
        .style("opacity", (d, i) => (i > 0 ? 1 : 0))
        .style("fill", (d) => d.color || "#000000")
        .attr("status", key)
        .attr("cx", (d) => {
          return x(d.name);
        })
        .attr("cy", (d) => {
          return y(d[key]);
        })
        .attr("r", 10)
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);
    });
    return {
      resize,
    };
  }
}
