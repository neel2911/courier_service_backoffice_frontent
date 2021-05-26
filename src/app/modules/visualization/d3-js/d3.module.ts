import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { D3Service } from "./services/d3.service";
import { LineGraphComponent } from "./components/line-graph/line-graph.component";
import { VerticalBarChartComponent } from "./components/bar-chart/vertical-bar-chart/vertical-bar-chart.component";
import { NodeGraphComponent } from "./components/node-graph/node-graph.component";
import { HorizontalBarChartComponent } from "./components/bar-chart/horizontal-bar-chart/horizontal-bar-chart.component";
import { VerticalStackedBarChartComponent } from "./components/bar-chart/vertical-stacked-bar-chart/vertical-stacked-bar-chart.component";
import { HorizontalStackedBarChartComponent } from "./components/bar-chart/horizontal-stacked-bar-chart/horizontal-stacked-bar-chart.component";

@NgModule({
  declarations: [
    LineGraphComponent,
    VerticalBarChartComponent,
    NodeGraphComponent,
    HorizontalBarChartComponent,
    VerticalStackedBarChartComponent,
    HorizontalStackedBarChartComponent,
  ],
  imports: [CommonModule],
  exports: [
    LineGraphComponent,
    VerticalBarChartComponent,
    NodeGraphComponent,
    HorizontalBarChartComponent,
    VerticalStackedBarChartComponent,
    HorizontalStackedBarChartComponent,
  ],
  providers: [D3Service],
})
export class D3Module {}
