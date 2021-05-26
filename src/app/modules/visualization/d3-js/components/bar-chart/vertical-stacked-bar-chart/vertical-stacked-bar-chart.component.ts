import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation,
} from "@angular/core";
import { fromEvent } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { D3Service } from "../../../services/d3.service";

@Component({
  selector: "app-vertical-stacked-bar-chart",
  templateUrl: "./vertical-stacked-bar-chart.component.html",
  styleUrls: ["./vertical-stacked-bar-chart.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class VerticalStackedBarChartComponent
  implements OnInit, AfterViewInit, OnChanges
{
  @Input() verticalStackedBarChartId = "sample_vertical_stacked_bar_chart_id_1";
  @Input() chartData: any;
  @Input() keysForStack = [];
  @Input() width: any = 1920;
  @Input() height: any = 969;
  @Input() barColor: any = [];
  public verticalStackedBarChart = null;
  constructor(private _d3Service: D3Service) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    fromEvent(window, "resize")
      .pipe(debounceTime(200))
      .subscribe(() => {
        if (this.verticalStackedBarChart) {
          this.verticalStackedBarChart.resize();
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.chartData) {
      if (Object.keys(changes.chartData.currentValue).length > 0) {
        setTimeout(() => {
          this._d3Service.d3.selection
            .select(`#${this.verticalStackedBarChartId}`)
            .selectAll("*")
            .remove();
          this.verticalStackedBarChart = this.renderBarGraph();
          if (this.verticalStackedBarChart) {
            this.verticalStackedBarChart.update(
              changes.chartData.currentValue.graphData,
              0
            );
            setTimeout(() => {
              this.verticalStackedBarChart.resize();
            }, 0);
          }
        }, 0);
      }
    }
  }

  renderBarGraph() {
    const d3 = this._d3Service.d3;

    // set the dimensions and margins of the graph
    const margin = { top: 10, right: 10, bottom: 40, left: 30 };
    const width = this.width - margin.left - margin.right;
    const height = this.height - margin.top - margin.bottom;

    const svg = this._d3Service.createSvg(
      this.verticalStackedBarChartId,
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
      .attr("class", "d3-vertical-stacked-bar-chart-tip")
      .offset([-10, 0])
      .html((event, value) => {
        let selectedValue;
        console.log(event, value);
        this.keysForStack.forEach((key) => {
          if (value.data[key] === value[1] - value[0]) {
            selectedValue = value.data[`${key}Extra`];
          }
        });
        console.log(selectedValue);
        return selectedValue.tooltip;
      });
    svg.call(tip);
    const { resize, heightAspect, widthAspect } = this._d3Service.responsivefy(
      svg,
      true
    );

    const x = d3.scale
      .scaleBand()
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3.scale
      .scaleLinear()
      .rangeRound([height - margin.bottom, margin.top]);

    const xAxis = mainGroup
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .attr("class", "x-axis");

    const yAxis = mainGroup
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .attr("class", "y-axis");

    const update = (data, speed) => {
      const keys = this.keysForStack;
      // Object.keys(this.chartData.graphData[0]).slice(1);
      const z = d3.scale.scaleOrdinal().range(this.barColor).domain(keys);
      data.forEach((d: any) => {
        keys.forEach((key) => {
          d[`${key}Extra`] = d[key];
          d[key] = d[key].value;
        });
        d.total = d3.array.sum(keys, (k) => +d[k]);
        return d;
      });

      y.domain([
        0,
        d3.array.max(data, (d) => d3.array.sum(keys, (k) => +d[k])),
      ]).nice();

      mainGroup
        .selectAll(".y-axis")
        .transition()
        .duration(speed)
        .call(d3.axis.axisLeft(y).ticks(5));
      // .ticks(null, "s")

      x.domain(data.map((d) => d.keyName));

      if (this.chartData.yAxisLabel && this.chartData.yAxisLabel.length > 0) {
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
          .text(this.chartData.yAxisLabel)
          .style("font-size", "15px")
          .style("transform", function (d) {
            const text = d3.selection.select(this);
            // console.log(text);
            return `translate(0px, ${
              (height - text.node().getComputedTextLength() - margin.bottom) / 2
            }px) rotate(-90deg)`;
          });
      }
      mainGroup
        .selectAll(".x-axis")
        .transition()
        .duration(speed)
        .call(d3.axis.axisBottom(x).tickSizeOuter(0))
        .selectAll("text")
        .attr("y", 0)
        .attr("x", 20)
        .attr("dy", "0.5em")
        .style("text-anchor", "end")
        .style("font-size", "12px")
        .attr("transform", "translate(0,10) rotate(-45)")
        .text((d) => d);

      setTimeout(() => {
        mainGroup
          .selectAll(".x-axis")
          .selectAll("text")
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
      }, 0);

      if (this.chartData.xAxisLabel && this.chartData.xAxisLabel.length > 0) {
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
          .text(this.chartData.xAxisLabel)
          .style("font-size", "15px")
          .style("transform", function (d) {
            const text = d3.selection.select(this);
            console.log(text);
            return `translate(${
              (width - text.node().getComputedTextLength()) / 2
            }px, ${(svg.select(".x-axis").node() as any).getBBox().height + 20}px) rotate(0deg)`;
          });
      }
      const group = mainGroup
        .selectAll("g.layer")
        .data(d3.shape.stack().keys(keys)(data), (d) => d.key);

      group.exit().remove();

      group
        .enter()
        .append("g")
        .classed("layer", true)
        .attr("fill", (d) => z(d.key));

      const bars = mainGroup
        .selectAll("g.layer")
        .selectAll("rect")
        .data(
          (d) => d,
          (e) => e.data.keyName
        );

      bars.exit().remove();

      bars
        .enter()
        .append("rect")
        .attr("width", x.bandwidth())
        .merge(bars)
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide)
        .transition()
        .duration(speed)
        .attr("x", (d) => x(d.data.keyName))
        .attr("y", (d) => y(d[1]))
        .attr("height", (d) => y(d[0]) - y(d[1]));

      const text = mainGroup.selectAll(".text").data(data, (d) => d.keyName);

      text.exit().remove();

      text
        .enter()
        .append("text")
        .attr("class", "text")
        .attr("text-anchor", "middle")
        .merge(text)
        .transition()
        .duration(speed)
        .attr("x", (d) => x(d.keyName) + x.bandwidth() / 2)
        .attr("y", (d) => y(d.total) - 5)
        .text((d) => d.total);
    };

    return {
      update,
      resize,
    };
  }
}
