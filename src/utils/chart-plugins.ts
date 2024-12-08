export const verticalHoverLine = {
  id: 'verticalHoverLine',
  beforeDatasetsDraw(chart: any, args: any, plugins: any) {
    const {ctx, chartArea: {top, bottom, height}} = chart;
    ctx.save();
    chart.getDatasetMeta(0).data.forEach((dataPoint: any, index: any) => {
      if (dataPoint.active === true) {
        ctx.beginPath();
        ctx.strokeStyle = '#d3d3d3';
        ctx.setLineDash([5, 5]);
        ctx.moveTo(dataPoint.x, top);
        ctx.lineTo(dataPoint.x, bottom);
        ctx.stroke();
      }
    })
    ctx.restore()
  }
}
