import { css, html, LitElement, PropertyValueMap } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import '@material/mwc-button'
import '@material/mwc-dialog'
import '@material/mwc-textfield'
import '@material/mwc-slider'
import { Dialog } from '@material/mwc-dialog';
import { TextField } from '@material/mwc-textfield'
import { Slider } from '@material/mwc-slider'
import { Point } from './types';
import { ratio } from './util'

const Path = paper.Path;
const Point = paper.Point;
const Color = paper.Color;

@customElement('mental-map')
export class MentalMap extends LitElement {

  private points: Point[] = []

  @query('canvas') canvas!: HTMLCanvasElement;
  @query('mwc-dialog') dialog!: Dialog;
  @query('#textfieldPoints') textfieldPoints!: TextField;
  @query('#sliderPoints') sliderPoints!: Slider;

  get view (): paper.View {
    // @ts-ignore
    return paper.view }

  static styles = css`
  canvas {
    background-color: white;
    /* border: 1px solid black; */
  }
  `

  render() {
    return html`
    <canvas width=640 height=640></canvas>
    <br>
    <mwc-button unelevated
      @click=${()=>{this.onGenerateClick()}}>generate</mwc-button>
    <mwc-button unelevated
      @click=${()=>{this.dialog.show()}}>options</mwc-button>


    <mwc-dialog heading=Options>
      <!-- <mwc-textfield label="point count" id=textfieldPoints type=number value=5></mwc-textfield> -->
      <mwc-slider
        discrete
        withTickMarks
        step=1
        min=1
        max=50
        value=5
        style="margin-top:40px;width:500px"
        id="sliderPoints"></mwc-slider>

      <mwc-button unelevated slot="secondaryAction"
        @click=${()=>{this.onGenerateClick()}}>generate</mwc-button>
    </mwc-dialog>
    `
  }

  protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
    // @ts-ignore
    paper.setup(this.canvas)

    this.generateNewMap()


    this.dialog.addEventListener('opened', () => {
      this.sliderPoints.layout()
    })
  }

  onGenerateClick () {
    this.drawMap(this.sliderPoints.value)
    this.dialog.close()
  }


  generateNewMap () {

    // this.placeRandomPoint()

    // @ts-ignore
    // this.view.draw()
  }

  getRandomPoint () {
    return [~~(Math.random() * 640), ~~(Math.random() * 640)] as [number, number]
  }

  drawPoint (center: [number, number], opacity: number) {
    return new Path.Circle({
      center,
      // radius: 18,
      radius: opacity * 5,
      strokeWidth: 9,
      strokeColor: 'black',
      fillColor: 'white',
      // opacity
    })
  }

  drawLine (sourcePoint: [number, number], targetPoint: [number, number], opacity: number) {
    new Path.Line({
      from: sourcePoint,
      to: targetPoint,
      opacity,
      strokeColor: 'grey',
      strokeWidth: 9
    })
  }

  drawMap (depth = 10) {
    this.clear()

    let i = 0, source, target, opacity

    for (let i = 0; i < depth; i++) {
      target = this.getRandomPoint()
      this.points.push(target)
      opacity = 1 - ratio(depth, i - 1)
      if (source) {
        this.drawLine(source, target, opacity)
        this.drawPoint(source, opacity)
      }
      else { // at start
        this.drawPoint(target, opacity)
      }
      source = target

      this.drawPoint(target, opacity)
    }
    console.log(JSON.stringify(this.points))
  }


  clear () {
    this.points = []
    // @ts-ignore
    paper.project.clear()
  }
}