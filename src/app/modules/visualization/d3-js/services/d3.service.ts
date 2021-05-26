import { Injectable } from "@angular/core";

import * as d3Tip from "d3-tip";
import * as d3Path from "d3-path";
import * as d3Array from "d3-array";
import * as d3Scale from "d3-scale";
import * as d3Selection from "d3-selection";
import * as d3Transition from "d3-transition";
import * as d3Shape from "d3-shape";
import * as d3TimeFormate from "d3-time-format";
import * as d3Zoom from "d3-zoom";
import * as d3Axis from "d3-axis";

@Injectable()
export class D3Service {
  d3: any = {
    tip: d3Tip,
    path: d3Path,
    array: d3Array,
    scale: d3Scale,
    selection: d3Selection,
    transition: d3Transition,
    shape: d3Shape,
    time: d3TimeFormate,
    zoom: d3Zoom,
    axis: d3Axis,
  };
  constructor() {}

  createSvg(svgId, width, height, margin) {
    return this.d3.selection
      .select(`#${svgId}`)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);
  }

  createGroup(
    selector,
    groupId,
    classes = [],
    transform: { x; y } = { x: 0, y: 0 }
  ) {
    return selector
      .append("g")
      .attr("id", groupId)
      .attr("classes", classes.join(" "))
      .style("transform", `translate(${transform.x}px, ${transform.y}px)`);
  }

  responsivefy(svg, isHeightNotToUpdate = false) {
    const container = this.d3.selection.select(
      svg.node().parentNode.parentNode
    );
    const width = parseInt(svg.style("width"), 10);
    const height = parseInt(svg.style("height"), 10);
    const aspect = width / height;

    const resize = () => {
      const targetWidth = parseInt(container.style("width"), 10);
      svg.attr("width", targetWidth);
      let targetHeight = targetWidth / aspect;
      if (isHeightNotToUpdate) {
        // Set Container Height as is.
        targetHeight = container.node().getBoundingClientRect().height;
      }
      svg.attr("height", Math.round(targetHeight));
      return {
        widthAspect: targetWidth / width,
        heightAspect: targetHeight / height,
        widht: parseInt(svg.style("width"), 10),
        height: parseInt(svg.style("height"), 10),
      };
    };
    svg
      .attr("viewBox", "0 0 " + width + " " + height)
      .attr("perserveAspectRatio", "xMidYMid")
      .call(() => {
        setTimeout(() => {
          resize();
        }, 10);
      });

    return {
      resize,
      widthAspect: parseInt(svg.style("width"), 10) / width,
      heightAspect: parseInt(svg.style("height"), 10) / height,
    };
  }
}
