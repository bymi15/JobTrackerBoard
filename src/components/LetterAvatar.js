import React from "react";

const colors = [
   [226, 95, 81],// A
   [242, 96, 145],// B
   [187, 101, 202],// C
   [149, 114, 207],// D
   [120, 132, 205],// E
   [91, 149, 249],// F
   [72, 194, 249],// G
   [69, 208, 226],// H
   [72, 182, 172],// I
   [82, 188, 137],// J
   [155, 206, 95],// K
   [212, 227, 74],// L
   [254, 218, 16],// M
   [247, 192, 0],// N
   [255, 168, 0],// O
   [255, 138, 96],// P
   [44, 62, 80],// Q
   [143, 164, 175],// R
   [162, 136, 126],// S
   [163, 163, 163],// T
   [175, 181, 226],// U
   [179, 155, 221],// V
   [194, 194, 194],// W
   [124, 222, 235],// X
   [188, 170, 164],// Y
   [173, 214, 125]// Z
 ];

class LetterAvatar extends React.Component {
   render() {
      const {name, size, radius, inline, customColor} = this.props;
      var letter = 'A';
      if(name){
         letter = name.trim()[0].toUpperCase();
      }

      var rgb = [0, 0, 0];
      if(customColor){
         rgb = customColor;
      }else{
         if(/[A-Z]/.test(letter)) {
            let index = letter.charCodeAt() - 65;
            rgb = colors[index]
         }
      }

      let style = {
         display: 'block',
         backgroundColor: `rgb(${rgb})`,
         width: size,
         height: size,
         font: Math.floor(size / 2) + 'px/100px Helvetica, Arial, sans-serif',
         lineHeight: (size + Math.floor(size / 10)) + 'px',
         color: "rgb(255,255,255)",
         textAlign: 'center',
         borderRadius: radius
      }

      if(inline) style = {...style, display: 'inline-block'};

      return (
         <span style={style}>
            {letter}
         </span>
      )
   };
};

export default LetterAvatar;