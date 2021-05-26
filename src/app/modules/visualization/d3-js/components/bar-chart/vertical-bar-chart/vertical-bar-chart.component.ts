import { AfterViewInit, Component, Input, OnInit } from "@angular/core";
import { fromEvent } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { D3Service } from "../../../services/d3.service";

@Component({
  selector: "app-vertical-bar-chart",
  templateUrl: "./vertical-bar-chart.component.html",
  styleUrls: ["./vertical-bar-chart.component.scss"],
})
export class VerticalBarChartComponent implements OnInit, AfterViewInit {
  @Input() barChartId = "sample_id_1";
  public verticalBarChart = null;
  constructor(private _d3Service: D3Service) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    fromEvent(window, "resize")
      .pipe(debounceTime(200))
      .subscribe(() => {
        if (this.verticalBarChart) {
          this.verticalBarChart.resize();
        }
      });
    this.verticalBarChart = this.renderBarGraph();
  }

  renderBarGraph() {
    const d3 = this._d3Service.d3;
    const data = [
      { salesperson: "Bob", sales: 33 },
      { salesperson: "Robin", sales: 12 },
      { salesperson: "Anne", sales: 41 },
      { salesperson: "Mark", sales: 16 },
      { salesperson: "Joe", sales: 59 },
      { salesperson: "Eve", sales: 38 },
      { salesperson: "Karen", sales: 21 },
      { salesperson: "Kirsty", sales: 25 },
      { salesperson: "Chris", sales: 30 },
      { salesperson: "Lisa", sales: 47 },
      { salesperson: "Tom", sales: 5 },
      { salesperson: "Stacy", sales: 20 },
      { salesperson: "Charles", sales: 13 },
      { salesperson: "Mary", sales: 29 },
    ];

    // set the dimensions and margins of the graph
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = 960 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // set the ranges
    const x = d3.scale.scaleBand().range([0, width]).padding(0.1);
    const y = d3.scale.scaleLinear().range([height, 0]);

    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    const svg = this._d3Service.createSvg(
      this.barChartId,
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

    const { resize, heightAspect, widthAspect } = this._d3Service.responsivefy(
      svg
    );
    // Scale the range of the data in the domains
    x.domain(
      data.map(function (d) {
        return d.salesperson;
      })
    );
    y.domain([
      0,
      d3.array.max(data, function (d) {
        return d.sales;
      }),
    ]);

    // append the rectangles for the bar chart
    mainGroup
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function (d) {
        return x(d.salesperson);
      })
      .attr("width", x.bandwidth())
      .attr("y", function (d) {
        return y(d.sales);
      })
      .attr("height", function (d) {
        return height - y(d.sales);
      });

    // add the x Axis
    mainGroup
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axis.axisBottom(x));

    // add the y Axis
    mainGroup.append("g").call(d3.axis.axisLeft(y));

    return {
      // updateData,
      resize,
    };
  }
}
