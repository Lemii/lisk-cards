import { imageNames, cardColors } from "../constants";
import { extractCode } from "../utils/extractCode";
import { calculateRarity } from "../utils/calculateRarity";
import base64img from "../assets/cardImages/cardImages.json";
import { CodeVariables } from "../types";

type Props = { code: string; maxWidth?: number; isDestroyed?: boolean };

const darkColors: Array<Number> = [3, 5, 7, 10, 11];

export default function CardViewer({
  code,
  maxWidth = 300,
  isDestroyed = false,
}: Props) {
  const codeVariables: CodeVariables = extractCode(code);

  const cardRarity: string = calculateRarity(codeVariables);

  let cardSVG: string = "";

  // SVG setup
  cardSVG =
    "<svg width='312' height='408' viewBox='0 0 312 408' fill='none' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'>";
  // apply card color
  cardSVG +=
    "<g filter='url(#filter0_d)'> <rect width='304' height='400' rx='20' fill='white'/> </g>";
  cardSVG += "<rect x='12' y='11' width='280' height='379' rx='20' fill='";
  let cardColor = codeVariables.color;
  cardSVG += "url(#paint0_linear)";
  cardSVG += "'/>";
  let gradients = cardColors[cardColor].split("-");
  cardSVG +=
    "<linearGradient id='paint0_linear' x1='152' y1='12' x2='152' y2='378' gradientUnits='userSpaceOnUse'><stop stop-color='#";
  cardSVG += gradients[0];
  cardSVG += "'/><stop offset='1' stop-color='#";
  cardSVG += gradients[1];
  cardSVG += "'/> </linearGradient>";

  cardSVG +=
    "<g filter='url(#filter1_i)'> <rect x='37' y='65' width='230' height='183' fill='white'/>";
  cardSVG +=
    "<rect x='37' y='65' width='230' height='183' fill='url(#pattern0)'/></g>";
  if (darkColors.find((clr) => clr === cardColor)) {
    cardSVG += "<text fill='#EEEEEE' ";
  } else {
    cardSVG += "<text fill='black' ";
  }
  cardSVG +=
    "xml:space='preserve' style='white-space: pre' font-family='Roboto' font-size='18' letter-spacing='0em'><tspan x='206' y='374.652'>lisk.cards</tspan></text>";
  if (darkColors.find((clr) => clr === cardColor)) {
    cardSVG += "<text fill='#EEEEEE' ";
  } else {
    cardSVG += "<text fill='black' ";
  }
  cardSVG +=
    "xml:space='preserve' style='white-space: pre' font-family='Roboto' font-size='48' text-anchor='middle' letter-spacing='0em' x='50%' y='300'>";
  cardSVG += imageNames[codeVariables.image];
  cardSVG += "</text>";
  if (darkColors.find((clr) => clr === cardColor)) {
    cardSVG += "<text fill='#EEEEEE' ";
  } else {
    cardSVG += "<text fill='black' ";
  }
  cardSVG +=
    "xml:space='preserve' style='white-space: pre' font-family='Roboto' font-size='18' letter-spacing='0em'><tspan x='25' y='374.652'>type: ";
  cardSVG += cardRarity;
  cardSVG += "</tspan></text>";
  cardSVG +=
    "<path d='M62.4755 25.8455L62 24.382L61.5245 25.8455L58.269 35.8647H47.7342H46.1953L47.4403 36.7693L55.9631 42.9615L52.7077 52.9807L52.2322 54.4443L53.4771 53.5398L62 47.3475L70.5229 53.5398L71.7678 54.4443L71.2923 52.9807L68.0369 42.9615L76.5597 36.7693L77.8047 35.8647H76.2658H65.731L62.4755 25.8455Z' fill='#E6EA15' stroke='#222222'/>"; // 1st star
  if (codeVariables.stars > 1) {
    cardSVG +=
      "<path d='M107.476 25.8455L107 24.382L106.524 25.8455L103.269 35.8647H92.7342H91.1953L92.4403 36.7693L100.963 42.9615L97.7077 52.9807L97.2322 54.4443L98.4771 53.5398L107 47.3475L115.523 53.5398L116.768 54.4443L116.292 52.9807L113.037 42.9615L121.56 36.7693L122.805 35.8647H121.266H110.731L107.476 25.8455Z' fill='#E6EA15' stroke='#222222'/>"; // 1st star
  } // 2nd star
  if (codeVariables.stars > 2) {
    cardSVG +=
      "<path d='M152.476 25.8455L152 24.382L151.524 25.8455L148.269 35.8647H137.734H136.195L137.44 36.7693L145.963 42.9615L142.708 52.9807L142.232 54.4443L143.477 53.5398L152 47.3475L160.523 53.5398L161.768 54.4443L161.292 52.9807L158.037 42.9615L166.56 36.7693L167.805 35.8647H166.266H155.731L152.476 25.8455Z' fill='#E6EA15' stroke='#222222'/>";
  } //3rd star
  if (codeVariables.stars > 3) {
    cardSVG +=
      "<path d='M197.476 25.8455L197 24.382L196.524 25.8455L193.269 35.8647H182.734H181.195L182.44 36.7693L190.963 42.9615L187.708 52.9807L187.232 54.4443L188.477 53.5398L197 47.3475L205.523 53.5398L206.768 54.4443L206.292 52.9807L203.037 42.9615L211.56 36.7693L212.805 35.8647H211.266H200.731L197.476 25.8455Z' fill='#E6EA15' stroke='#222222'/>";
  } // 4th star
  if (codeVariables.stars > 4) {
    cardSVG +=
      "<path d='M242.476 25.8455L242 24.382L241.524 25.8455L238.269 35.8647H227.734H226.195L227.44 36.7693L235.963 42.9615L232.708 52.9807L232.232 54.4443L233.477 53.5398L242 47.3475L250.523 53.5398L251.768 54.4443L251.292 52.9807L248.037 42.9615L256.56 36.7693L257.805 35.8647H256.266H245.731L242.476 25.8455Z' fill='#E6EA15' stroke='#222222'/>";
  } // 5th star
  cardSVG +=
    "<defs> <filter id='filter0_d' x='0' y='0' width='312' height='408' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'> <feFlood flood-opacity='0' result='BackgroundImageFix'/> <feColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0'/> <feOffset dx='4' dy='4'/> <feGaussianBlur stdDeviation='2'/> <feColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0'/>";
  cardSVG +=
    "<feBlend mode='normal' in2='BackgroundImageFix' result='effect1_dropShadow'/> <feBlend mode='normal' in='SourceGraphic' in2='effect1_dropShadow' result='shape'/> </filter> <filter id='filter1_i' x='37' y='65' width='232' height='185' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'> <feFlood flood-opacity='0' result='BackgroundImageFix'/> <feBlend mode='normal' in='SourceGraphic' in2='BackgroundImageFix' result='shape'/>";
  cardSVG +=
    "<feColorMatrix in='SourceAlpha' type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha'/> <feOffset dx='2' dy='2'/> <feGaussianBlur stdDeviation='2'/> <feComposite in2='hardAlpha' operator='arithmetic' k2='-1' k3='1'/> <feColorMatrix type='matrix' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0'/>";
  cardSVG +=
    "<feBlend mode='normal' in2='shape' result='effect1_innerShadow'/> </filter>";
  // add image
  cardSVG +=
    "<pattern id='pattern0' patternContentUnits='objectBoundingBox' width='1' height='1'><use xlink:href='#image0' transform='translate(-0.00833333) scale(0.00442029 0.00555556)'/></pattern>";
  cardSVG +=
    "<image id='image0' width='230' height='180' xlink:href='data:image/png;base64," +
    // @ts-ignore
    base64img[codeVariables.image] +
    "'/>";
  cardSVG += "</defs> </svg>";

  return (
    <div style={{ width: "100%", margin: "auto", marginBottom: "1em" }}>
      {!isDestroyed ? (
        <img
          src={`data:image/svg+xml;base64,${btoa(cardSVG)}`}
          alt={imageNames[codeVariables.image]}
          style={{
            width: `100%`,
            maxWidth: `${maxWidth}px`,
            cursor: "pointer",
          }}
        />
      ) : (
        <img
          src={`data:image/svg+xml;base64,${btoa(cardSVG)}`}
          alt={imageNames[codeVariables.image]}
          style={{
            width: `100%`,
            maxWidth: `${maxWidth}px`,
            filter: "grayscale(100%)",
          }}
        />
      )}
    </div>
  );
}
